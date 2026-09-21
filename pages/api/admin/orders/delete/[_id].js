import nc from "next-connect";
import auth from "../../../../../middlewares/admin-auth";
import Order from "../../../../../models/order.model";
import connectDB from "../../../../../utils/connectDB";
import { ownsShop } from "../../../../../utils/shared/auth";
import { fail, isObjectId } from "../../../../../utils/shared/security";

const handler = nc();

handler.delete(auth, async (req, res) => {
  const { _id } = req.query;
  if (!isObjectId(_id)) {
    return res.status(400).json({ message: "Invalid order" });
  }
  try {
    await connectDB();
    const order = await Order.findById(_id).select("shop");
    // same answer for "missing" and "not yours" (no id probing)
    if (!order || !ownsShop(req, order.shop)) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.findByIdAndDelete(_id);

    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    fail(res, err, 400, "Could not delete the order");
  }
});

export default handler;
