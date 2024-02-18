import nc from "next-connect";
import auth from "../../../../../middlewares/admin-auth";
import Order from "../../../../../models/order.model";
import connectDB from "../../../../../utils/connectDB";

const handler = nc();

handler.delete(auth, async (req, res) => {
  await connectDB();
  const { _id } = req.query;
  try {
    await Order.findByIdAndDelete(_id);

    res.status(200).json({ message: "order deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
