import nc from "next-connect";
import connectDB from "../../../../../utils/connectDB";
import Product from "../../../../../models/product.model";
import auth from "../../../../../middlewares/admin-auth";
import { removeFile } from "../../../../../utils/shared/removeFile";

const handler = nc();

handler.delete(auth, async (req, res) => {
  await connectDB();
  const { _id } = req.query;
  try {
    const product = await Product.findByIdAndDelete(_id);

    for (let image of product.images) {
      removeFile(image.split("/").pop());
    }

    res.status(200).json({ message: "deleted product" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
