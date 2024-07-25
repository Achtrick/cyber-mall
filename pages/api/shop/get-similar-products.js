import mongoose from "mongoose";
import nc from "next-connect";
import Product from "../../../models/product.model";
import connectDB from "../../../utils/connectDB";

const handler = nc();

handler.post(async (req, res) => {
  const { shopId, categoryId } = req.body;
  try {
    await connectDB();
    const products = await Product.aggregate([
      {
        $match: {
          shop: mongoose.Types.ObjectId(shopId),
          category: mongoose.Types.ObjectId(categoryId),
        },
      },
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1,
          designation: 1,
          slug: 1,
          qty: 1,
          price: 1,
          discount: 1,
          variants: 1,
          images: { $slice: ["$images", 1] },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
