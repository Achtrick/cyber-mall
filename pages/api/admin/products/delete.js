import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";
import { removeFile } from "../../../../utils/shared/removeFile";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const { productId } = req.body;
  try {
    await deleteProduct(productId);

    res.status(200).json({ message: "Produit Supprimé" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  for (let image of product.images) {
    removeFile(image.split("/").pop());
  }
};

export default handler;
