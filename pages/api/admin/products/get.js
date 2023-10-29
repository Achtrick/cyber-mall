import nc from "next-connect";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.post(async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
