import mongoose from "mongoose";
import nc from "next-connect";
import Product from "../../../models/product.model";
import connectDB from "../../../utils/connectDB";

const handler = nc();

handler.post(async (req, res) => {
  const { id, shopId } = req.body;
  const query = { shop: mongoose.Types.ObjectId(shopId), _id: id };

  try {
    await connectDB();
    const product = await Product.findOne(query);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
