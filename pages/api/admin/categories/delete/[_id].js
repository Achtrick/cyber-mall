import nc from "next-connect";
import connectDB from "../../../../../utils/connectDB";
import ProductCategory from "../../../../../models/productCategory.model";
import auth from "../../../../../middlewares/admin-auth";

const handler = nc();

handler.delete(auth, async (req, res) => {
  await connectDB();
  const { _id } = req.query;
  console.log(req.body);
  try {
    await ProductCategory.findOneAndRemove({ _id: _id });

    res.status(200).json({ message: "deleted catgegory" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
