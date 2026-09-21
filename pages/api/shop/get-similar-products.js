import mongoose from "mongoose";
import nc from "next-connect";
import Product from "../../../models/product.model";
import connectDB from "../../../utils/connectDB";
import { fail, isObjectId } from "../../../utils/shared/security";

const handler = nc();

handler.post(async (req, res) => {
  const { shopId, categoryId } = req.body || {};
  if (!isObjectId(shopId) || !isObjectId(categoryId)) {
    return res.status(400).json({ message: "Invalid request" });
  }
  try {
    await connectDB();
    const products = await Product.aggregate([
      {
        $match: {
          shop: new mongoose.Types.ObjectId(shopId),
          category: new mongoose.Types.ObjectId(categoryId),
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
    fail(res, err);
  }
});

export default handler;
