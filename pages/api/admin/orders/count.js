import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Order from "../../../../models/order.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { fail } from "../../../../utils/shared/security";

const handler = nc();

handler.post(auth, async (req, res) => {
  // always the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, req.body?.shop);
  if (!shopId) return;

  try {
    await connectDB();
    const count = await Order.countDocuments({ shop: shopId, state: "WAITING" });

    res.status(200).json(count);
  } catch (err) {
    fail(res, err);
  }
});

export default handler;
