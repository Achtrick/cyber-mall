import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import ProductCategory from "../../../../models/productCategory.model";
import auth from "../../../../middlewares/admin-auth";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    await ProductCategory.create(data);

    res.status(200).json({ message: "created catgegory" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
