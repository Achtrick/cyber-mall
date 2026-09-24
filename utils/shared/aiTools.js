import mongoose from "mongoose";
import Order from "../../models/order.model";
import Product from "../../models/product.model";
import ProductCategory from "../../models/productCategory.model";
import Shop from "../../models/shop.model";
import { escapeRegex, isObjectId, num, str } from "./security";

// ---------------------------------------------------------------------------
// Tool definitions + executors for the admin AI assistant
// (pages/api/admin/ai/chat.js). Every executor takes (input, ctx) where
// ctx.shopId is the CALLING ADMIN'S OWN shop, taken from the verified JWT --
// never from the model's tool input -- and every DB query below is scoped to
// it. This is the same boundary every other admin API route enforces.
// ---------------------------------------------------------------------------

const LOW_STOCK_DEFAULT_THRESHOLD = 10;

const productSummary = (p) => ({
  id: String(p._id),
  designation: p.designation,
  qty: p.qty,
  price: p.price,
  category: p.category?.name ?? null,
});

/** Resolve a product the admin referred to by id or (possibly partial) name. */
const resolveProduct = async (shopId, { productId, designation }) => {
  if (productId) {
    if (!isObjectId(productId)) return { error: "That product id isn't valid." };
    const product = await Product.findOne({ _id: productId, shop: shopId });
    if (!product) return { error: "No product with that id in this shop." };
    return { product };
  }

  const name = str(designation, 200);
  if (!name) return { error: "Give either productId or designation." };

  const exact = await Product.findOne({
    shop: shopId,
    designation: new RegExp(`^${escapeRegex(name)}$`, "i"),
  });
  if (exact) return { product: exact };

  const matches = await Product.find({
    shop: shopId,
    designation: new RegExp(escapeRegex(name), "i"),
  })
    .limit(6)
    .lean();

  if (matches.length === 1) {
    const full = await Product.findById(matches[0]._id);
    return { product: full };
  }
  if (matches.length === 0) {
    return { error: `No product matching "${name}" was found. Try search_products.` };
  }
  return {
    error: `"${name}" matches more than one product -- ask the admin which one, or call this again with productId.`,
    candidates: matches.map(productSummary),
  };
};

export const AI_TOOLS = [
  {
    name: "get_stock_report",
    description:
      "Get an overview of the shop's inventory health: total product count, out-of-stock count, low-stock count, total units in stock, and the products with the lowest quantity (the ones closest to running out / 'expiring' stock). Use this for 'show me the stock report', 'what's low on stock', 'what's about to run out'.",
    input_schema: {
      type: "object",
      properties: {
        threshold: {
          type: "integer",
          description: "Quantity at or below which a product counts as low-stock. Default 10.",
        },
        limit: {
          type: "integer",
          description: "How many lowest-stock products to list. Default 10, max 50.",
        },
      },
    },
  },
  {
    name: "search_products",
    description:
      "Search this shop's products by name (partial, case-insensitive match). Use this to resolve a product the admin named loosely (e.g. 'product x') before adjusting its quantity, or to answer 'do we sell X' questions.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Product name or partial name." },
      },
      required: ["query"],
    },
  },
  {
    name: "adjust_product_quantity",
    description:
      "Change a product's stock quantity. Identify the product with productId (preferred, e.g. from a prior search_products/get_stock_report call) or designation (its name). Give exactly one of: delta (positive to add stock, negative to remove) or setQuantity (an absolute new value, >= 0). If the name is ambiguous or not found, this returns candidates or an error instead of guessing -- resolve it (ask the admin, or call search_products) before retrying.",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string", description: "The product's id, if already known." },
        designation: { type: "string", description: "The product's name, if the id isn't known." },
        delta: { type: "integer", description: "Amount to add (positive) or remove (negative)." },
        setQuantity: { type: "integer", minimum: 0, description: "Absolute new quantity." },
      },
    },
  },
  {
    name: "get_recent_orders",
    description:
      "List recent orders for this shop, optionally filtered by status. WAITING means pending/unfulfilled, CLOSED means fulfilled. Use this for 'how many pending orders', 'show recent orders', 'what did we sell recently'.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["WAITING", "CLOSED"] },
        limit: { type: "integer", description: "Default 10, max 50." },
      },
    },
  },
  {
    name: "get_shop_overview",
    description:
      "Get a quick summary of the shop: product count, category count, pending vs closed order counts, and subscription plan. Use this for general 'how's my shop doing' / 'give me an overview' questions.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "update_order_status",
    description:
      "Change an order's fulfillment state. WAITING means pending/unfulfilled, CLOSED means fulfilled. Use this to mark an order as fulfilled/closed, or to reopen one. Identify the order by orderId -- use search_orders_by_customer or get_recent_orders first if the admin only gave a customer name.",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string", description: "The order's id." },
        status: { type: "string", enum: ["WAITING", "CLOSED"], description: "The new state." },
      },
      required: ["orderId", "status"],
    },
  },
  {
    name: "get_order_details",
    description:
      "Get full detail for a single order by id: customer name/address/phone, every line item (product, quantity, price), state, computed total, and when it was placed. Use this when the admin asks about a specific order.",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string", description: "The order's id." },
      },
      required: ["orderId"],
    },
  },
  {
    name: "search_orders_by_customer",
    description:
      "Find this shop's orders by customer name and/or phone (partial, case-insensitive match), most recent first. Use this when the admin refers to a customer by name or phone instead of an order id, e.g. before calling update_order_status or get_order_details.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer first and/or last name, or part of it." },
        phone: { type: "string", description: "Customer phone number, or part of it." },
        limit: { type: "integer", description: "Default 10, max 50." },
      },
    },
  },
  {
    name: "get_top_products",
    description:
      "Rank this shop's products by units sold or revenue, aggregated from CLOSED (fulfilled) orders only -- so the numbers reflect actual completed sales, not pending/unfulfilled carts. Use order 'desc' (default) for best sellers, 'asc' for worst sellers.",
    input_schema: {
      type: "object",
      properties: {
        limit: { type: "integer", description: "Default 10, max 50." },
        sortBy: {
          type: "string",
          enum: ["unitsSold", "revenue"],
          description: "What to rank by. Default unitsSold.",
        },
        order: {
          type: "string",
          enum: ["desc", "asc"],
          description: "Default desc (best sellers first). Use asc for worst sellers first.",
        },
      },
    },
  },
  {
    name: "update_product_price",
    description:
      "Change a product's price and/or discount percentage. Identify the product with productId (preferred) or designation, resolved the same way as adjust_product_quantity -- if the name is ambiguous or not found, this returns candidates or an error instead of guessing. Give at least one of price (new absolute price) or discount (new discount percentage, 0-100).",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string", description: "The product's id, if already known." },
        designation: { type: "string", description: "The product's name, if the id isn't known." },
        price: { type: "number", minimum: 0, description: "New absolute price." },
        discount: { type: "number", minimum: 0, maximum: 100, description: "New discount percentage (0-100)." },
      },
    },
  },
];

export const AI_TOOL_EXECUTORS = {
  get_stock_report: async (input, { shopId }) => {
    const threshold = num(input?.threshold, { min: 0, max: 100000, def: LOW_STOCK_DEFAULT_THRESHOLD, int: true });
    const limit = num(input?.limit, { min: 1, max: 50, def: 10, int: true });

    const [totalProducts, outOfStockCount, lowStockCount, lowestStock, valueAgg] = await Promise.all([
      Product.countDocuments({ shop: shopId }),
      Product.countDocuments({ shop: shopId, qty: { $lte: 0 } }),
      Product.countDocuments({ shop: shopId, qty: { $lte: threshold } }),
      Product.find({ shop: shopId })
        .sort({ qty: 1 })
        .limit(limit)
        .populate("category", "name")
        .lean(),
      Product.aggregate([
        { $match: { shop: new mongoose.Types.ObjectId(shopId) } },
        { $group: { _id: null, units: { $sum: "$qty" }, value: { $sum: { $multiply: ["$qty", "$price"] } } } },
      ]),
    ]);

    return {
      threshold,
      totalProducts,
      outOfStockCount,
      lowStockCount,
      totalUnitsInStock: valueAgg[0]?.units ?? 0,
      estimatedInventoryValue: Math.round((valueAgg[0]?.value ?? 0) * 100) / 100,
      lowestStockProducts: lowestStock.map(productSummary),
    };
  },

  search_products: async (input, { shopId }) => {
    const query = str(input?.query, 200);
    if (!query) return { error: "query is required" };
    const matches = await Product.find({
      shop: shopId,
      designation: new RegExp(escapeRegex(query), "i"),
    })
      .limit(20)
      .populate("category", "name")
      .lean();
    return { count: matches.length, products: matches.map(productSummary) };
  },

  adjust_product_quantity: async (input, { shopId }) => {
    const hasDelta = input?.delta !== undefined && input?.delta !== null;
    const hasSet = input?.setQuantity !== undefined && input?.setQuantity !== null;
    if (hasDelta === hasSet) {
      return { error: "Give exactly one of delta or setQuantity." };
    }

    const { product, error, candidates } = await resolveProduct(shopId, input ?? {});
    if (error) return { error, candidates };

    // defense in depth: resolveProduct already scoped the query to shopId
    if (String(product.shop) !== String(shopId)) {
      return { error: "That product does not belong to this shop." };
    }

    const previousQty = product.qty;
    const requested = hasSet
      ? num(input.setQuantity, { min: 0, max: 10000000, int: true })
      : previousQty + num(input.delta, { min: -10000000, max: 10000000, int: true });
    const newQty = Math.max(0, requested);

    product.qty = newQty;
    await product.save();

    return {
      productId: String(product._id),
      designation: product.designation,
      previousQty,
      newQty,
      change: newQty - previousQty,
    };
  },

  get_recent_orders: async (input, { shopId }) => {
    const limit = num(input?.limit, { min: 1, max: 50, def: 10, int: true });
    const filter = { shop: shopId };
    if (input?.status === "WAITING" || input?.status === "CLOSED") filter.state = input.status;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    return {
      count: orders.length,
      orders: orders.map((o) => ({
        id: String(o._id),
        state: o.state,
        customer: `${o.user?.firstName ?? ""} ${o.user?.lastName ?? ""}`.trim(),
        itemCount: (o.products ?? []).reduce((n, p) => n + (p.qty ?? 0), 0),
        total: (o.products ?? []).reduce((sum, p) => sum + (p.qty ?? 0) * (p.price ?? 0), 0),
        createdAt: o.createdAt,
      })),
    };
  },

  get_shop_overview: async (_input, { shopId }) => {
    const [shop, productCount, categoryCount, waitingOrders, closedOrders] = await Promise.all([
      Shop.findById(shopId).select("name pack currency").lean(),
      Product.countDocuments({ shop: shopId }),
      ProductCategory.countDocuments({ shop: shopId }),
      Order.countDocuments({ shop: shopId, state: "WAITING" }),
      Order.countDocuments({ shop: shopId, state: "CLOSED" }),
    ]);
    return {
      shopName: shop?.name ?? null,
      plan: shop?.pack?.type ?? null,
      currency: shop?.currency ?? null,
      productCount,
      categoryCount,
      pendingOrders: waitingOrders,
      closedOrders,
    };
  },

  update_order_status: async (input, { shopId }) => {
    if (!isObjectId(input?.orderId)) return { error: "That order id isn't valid." };
    if (input?.status !== "WAITING" && input?.status !== "CLOSED") {
      return { error: "status must be WAITING or CLOSED." };
    }

    const order = await Order.findOne({ _id: input.orderId, shop: shopId });
    if (!order) return { error: "No order with that id in this shop." };

    // defense in depth: the query above already scoped this to shopId
    if (String(order.shop) !== String(shopId)) {
      return { error: "That order does not belong to this shop." };
    }

    const previousState = order.state;
    order.state = input.status;
    await order.save();

    return {
      orderId: String(order._id),
      customer: `${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`.trim(),
      itemCount: (order.products ?? []).reduce((n, p) => n + (p.qty ?? 0), 0),
      previousState,
      newState: order.state,
    };
  },

  get_order_details: async (input, { shopId }) => {
    if (!isObjectId(input?.orderId)) return { error: "That order id isn't valid." };

    const order = await Order.findOne({ _id: input.orderId, shop: shopId }).lean();
    if (!order) return { error: "No order with that id in this shop." };

    const items = (order.products ?? []).map((p) => ({
      designation: p.designation,
      qty: p.qty,
      price: p.price,
      lineTotal: Math.round((p.qty ?? 0) * (p.price ?? 0) * 100) / 100,
    }));

    return {
      orderId: String(order._id),
      state: order.state,
      customer: {
        name: `${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`.trim(),
        phone: order.user?.phone ?? "",
        address: order.user?.address ?? "",
        postalCode: order.user?.postalCode ?? "",
        city: order.user?.city ?? "",
      },
      items,
      itemCount: items.reduce((n, i) => n + (i.qty ?? 0), 0),
      total: Math.round(items.reduce((sum, i) => sum + i.lineTotal, 0) * 100) / 100,
      createdAt: order.createdAt,
    };
  },

  search_orders_by_customer: async (input, { shopId }) => {
    const name = str(input?.name, 100);
    const phone = str(input?.phone, 50);
    if (!name && !phone) return { error: "Give a customer name and/or phone to search for." };
    const limit = num(input?.limit, { min: 1, max: 50, def: 10, int: true });

    const clauses = [];
    if (name) {
      const re = new RegExp(escapeRegex(name), "i");
      clauses.push({ "user.firstName": re }, { "user.lastName": re });
    }
    if (phone) {
      clauses.push({ "user.phone": new RegExp(escapeRegex(phone), "i") });
    }

    const orders = await Order.find({ shop: shopId, $or: clauses })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      count: orders.length,
      orders: orders.map((o) => ({
        id: String(o._id),
        state: o.state,
        customer: `${o.user?.firstName ?? ""} ${o.user?.lastName ?? ""}`.trim(),
        itemCount: (o.products ?? []).reduce((n, p) => n + (p.qty ?? 0), 0),
        total: (o.products ?? []).reduce((sum, p) => sum + (p.qty ?? 0) * (p.price ?? 0), 0),
        createdAt: o.createdAt,
      })),
    };
  },

  get_top_products: async (input, { shopId }) => {
    const limit = num(input?.limit, { min: 1, max: 50, def: 10, int: true });
    const sortBy = input?.sortBy === "revenue" ? "revenue" : "unitsSold";
    const sortDir = input?.order === "asc" ? 1 : -1;

    const results = await Order.aggregate([
      { $match: { shop: new mongoose.Types.ObjectId(shopId), state: "CLOSED" } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.designation",
          unitsSold: { $sum: "$products.qty" },
          revenue: { $sum: { $multiply: ["$products.qty", "$products.price"] } },
        },
      },
      { $sort: { [sortBy]: sortDir, _id: 1 } },
      { $limit: limit },
    ]);

    return {
      basis: "CLOSED orders only",
      sortBy,
      order: sortDir === 1 ? "asc" : "desc",
      products: results.map((r) => ({
        designation: r._id,
        unitsSold: r.unitsSold,
        revenue: Math.round(r.revenue * 100) / 100,
      })),
    };
  },

  update_product_price: async (input, { shopId }) => {
    const hasPrice = input?.price !== undefined && input?.price !== null;
    const hasDiscount = input?.discount !== undefined && input?.discount !== null;
    if (!hasPrice && !hasDiscount) {
      return { error: "Give at least one of price or discount." };
    }

    const { product, error, candidates } = await resolveProduct(shopId, input ?? {});
    if (error) return { error, candidates };

    // defense in depth: resolveProduct already scoped the query to shopId
    if (String(product.shop) !== String(shopId)) {
      return { error: "That product does not belong to this shop." };
    }

    const changes = {};
    if (hasPrice) {
      const previousPrice = product.price;
      product.price = num(input.price, { min: 0, max: 100000000, def: previousPrice });
      changes.price = { previous: previousPrice, new: product.price };
    }
    if (hasDiscount) {
      const previousDiscount = product.discount;
      product.discount = num(input.discount, { min: 0, max: 100, def: previousDiscount });
      changes.discount = { previous: previousDiscount, new: product.discount };
    }

    await product.save();

    return {
      productId: String(product._id),
      designation: product.designation,
      ...changes,
    };
  },
};
