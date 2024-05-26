import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Order from "../../../../models/order.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { shop } = req.body;

  try {
    await connectDB();
    const count = await Order.countDocuments({ shop: shop, state: "WAITING" });

    res.status(200).json(count);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
