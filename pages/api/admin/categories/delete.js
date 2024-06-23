import mongoose from "mongoose";
import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";
import ProductCategory from "../../../../models/productCategory.model";
import connectDB from "../../../../utils/connectDB";
import { removeFile } from "../../../../utils/shared/removeFile";
import { deleteProduct } from "../products/delete";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();

  try {
    const { categoryId } = req.body;
    await deleteCategory(categoryId);

    res
      .status(200)
      .json({ message: "Catégorie et produits associés sont supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

export const deleteCategory = async (categoryId) => {
  const category = await ProductCategory.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: "Catégorie introuvable" });
  }
  removeFile(category.icon.split("/").pop());

  const products = await Product.find({
    category: mongoose.Types.ObjectId(category._id),
  });
  for (const product of products) {
    await deleteProduct(product._id);
  }
  await ProductCategory.findByIdAndDelete(categoryId);
};

export default handler;
