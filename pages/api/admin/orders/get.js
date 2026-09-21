import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Order from "../../../../models/order.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { fail, num, searchRegexes } from "../../../../utils/shared/security";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { searchTerm, page, shop } = req.body || {};
  // always the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, shop);
  if (!shopId) return;

  const query = { shop: shopId };

  const terms = searchRegexes(searchTerm).map((r) => ({
    $or: [{ "user.firstName": r }, { "user.lastName": r }],
  }));
  if (terms.length) query.$or = terms;
  const pageNumber = num(page, { min: 1, max: 100000, def: 1, int: true });

  try {
    await connectDB();

    const orders = await Order.find(query)
      .sort({ state: -1 })
      .sort({ createdAt: -1 })
      .limit(20)
      .skip((pageNumber - 1) * 20);

    const totalOrders = await Order.countDocuments(query);

    const count = Math.ceil(totalOrders / 20);

    res.status(200).json({ orders: orders, count: count });
  } catch (err) {
    fail(res, err);
  }
});

export default handler;
