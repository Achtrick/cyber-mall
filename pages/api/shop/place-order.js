import nc from "next-connect";
import Order from "../../../models/order.model";
import Product from "../../../models/product.model";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";
import { fail, isObjectId, num, rateLimit, str } from "../../../utils/shared/security";

const handler = nc();

// Public endpoint (customers are not logged in): nothing the client sends about
// prices or product data is trusted, it is rebuilt from the database.
handler.post(async (req, res) => {
  if (!rateLimit(req, res, { name: "place-order", max: 15, windowMs: 60 * 60 * 1000 })) return;

  const { shop, user, products } = req.body || {};
  if (!isObjectId(shop)) return res.status(400).json({ message: "Invalid shop" });
  if (!Array.isArray(products) || !products.length || products.length > 50) {
    return res.status(400).json({ message: "Your cart is empty" });
  }

  const customer = {
    firstName: str(user?.firstName, 60),
    lastName: str(user?.lastName, 60),
    address: str(user?.address, 300),
    postalCode: str(user?.postalCode, 20),
    city: str(user?.city, 80),
    phone: str(user?.phone, 30),
  };
  if (!customer.firstName || !customer.lastName || !customer.phone) {
    return res.status(400).json({ message: "Please fill in your contact details" });
  }

  try {
    await connectDB();
    const shopDoc = await Shop.findById(shop).select("banned verified");
    if (!shopDoc || shopDoc.banned || !shopDoc.verified) {
      return res.status(400).json({ message: "Shop not found!" });
    }

    const items = [];
    for (const item of products) {
      if (!isObjectId(item?._id)) {
        return res.status(400).json({ message: "Invalid product in cart" });
      }
      const qty = num(item.qty, { min: 1, max: 1000, def: 1, int: true });
      const product = await Product.findOne({ _id: item._id, shop });
      if (!product) {
        return res.status(400).json({ message: "A product in your cart is no longer available" });
      }
      // the cart names a chosen variant "<designation> | <variant>": keep it if valid
      const prefix = `${product.designation} | `;
      const variant =
        typeof item.designation === "string" && item.designation.startsWith(prefix)
          ? item.designation.slice(prefix.length)
          : "";
      items.push({
        _id: product._id,
        designation:
          variant && product.variants.includes(variant)
            ? prefix + variant
            : product.designation,
        slug: product.slug,
        images: product.images.slice(0, 1),
        price: product.discount
          ? product.price - (product.price * product.discount) / 100
          : product.price,
        discount: product.discount,
        variants: product.variants,
        description: product.description,
        qty,
        category: product.category,
        shop: product.shop,
      });
    }

    await Order.create({ shop, user: customer, products: items });
    res.status(200).json({
      message: "Order placed, expect a call from customer service.",
    });
  } catch (err) {
    fail(res, err, 400, "Could not place the order");
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
