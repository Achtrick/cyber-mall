import nc from "next-connect";
import connectDB from "../../../../../utils/connectDB";
import Product from "../../../../../models/product.model";
import auth from "../../../../../middlewares/admin-auth";

const handler = nc();

handler.delete(auth, async (req, res) => {
  await connectDB();
  const { _id } = req.query;
  console.log(req.body);
  try {
    await Product.findOneAndRemove({ _id: _id });

    res.status(200).json({ message: "deleted product" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
