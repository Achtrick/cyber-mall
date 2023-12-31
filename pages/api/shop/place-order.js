import nc from "next-connect";
import Product from "../../../models/product.model";
import connectDB from "../../../utils/connectDB";
import mongoose from "mongoose";
import Order from "../../../models/order.model";

const handler = nc();

handler.post(async (req, res) => {
  const { shop, user, products } = req.body;

  const query = {
    shop: mongoose.Types.ObjectId(shop),
    user: user,
    products: products,
  };

  try {
    await connectDB();
    const order = await Order.create(query);
    order.save();
    res
      .status(200)
      .json({
        message: "order placed, expect a call from customer service ^^",
      });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};
