import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import ProductCategory from "../../../../models/productCategory.model";

const handler = nc();

handler.post(async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    const categories = await ProductCategory.find({ shop: data.shop });

    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
