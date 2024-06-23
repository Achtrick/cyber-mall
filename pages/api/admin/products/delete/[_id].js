import nc from "next-connect";
import auth from "../../../../../middlewares/admin-auth";
import Product from "../../../../../models/product.model";
import connectDB from "../../../../../utils/connectDB";
import { removeFile } from "../../../../../utils/shared/removeFile";

const handler = nc();

handler.delete(auth, async (req, res) => {
  await connectDB();
  const { _id } = req.query;
  try {
    await deleteProduct(_id);

    res.status(200).json({ message: "Produit Supprimé" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export const deleteProduct = async (_id) => {
  const product = await Product.findByIdAndDelete(_id);

  for (let image of product.images) {
    removeFile(image.split("/").pop());
  }
};

export default handler;
