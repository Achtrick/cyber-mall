import nc from "next-connect";
import Product from "../../../models/product.model";
import connectDB from "../../../utils/connectDB";
import mongoose from "mongoose";

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

  console.log(query);
  try {
    await connectDB();
    const products = await Product.find(query)
      .sort(sortOrder)
      .limit(5)
      .skip((page - 1) * 5);
    const totalProducts = await Product.countDocuments(query);
    const count = Math.ceil(totalProducts / 5);
    res.status(200).json({ products: products, count: count });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
