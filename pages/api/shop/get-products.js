import mongoose from "mongoose";
import nc from "next-connect";
import Product from "../../../models/product.model";
import connectDB from "../../../utils/connectDB";

const handler = nc();

handler.post(async (req, res) => {
  const { searchTerm, sort, category, page, shopId } = req.body;
  const query = { shop: mongoose.Types.ObjectId(shopId) };
  let sortOrder = { createdAt: -1 };

  if (searchTerm && searchTerm !== "") {
    var blocks = searchTerm.split(" ");
    var terms = await blocks.map((b) => {
      return { designation: { $regex: ".*" + b + ".*", $options: "i" } };
    });
    query.$or = terms;
  }

  if (category) {
    query.category = mongoose.Types.ObjectId(category);
  }

  if (sort) {
    sortOrder = { price: sort };
  }

  try {
    await connectDB();
    const products = await Product.find(query, { images: { $slice: 1 } })
      .sort(sortOrder)
      .limit(12)
      .skip((page - 1) * 12);
    const totalProducts = await Product.countDocuments(query);
    const count = Math.ceil(totalProducts / 12);
    res.status(200).json({ products: products, count: count });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
