import axios from "axios";
import mongoose from "mongoose";
import nc from "next-connect";
import auth from "../../../../../middlewares/admin-auth";
import Product from "../../../../../models/product.model";
import ProductCategory from "../../../../../models/productCategory.model";
import connectDB from "../../../../../utils/connectDB";
import { removeFile } from "../../../../../utils/shared/removeFile";

const handler = nc();

handler.delete(auth, async (req, res) => {
  axios.defaults.headers.common["Authorization"] = req.headers.authorization;

  await connectDB();

  try {
    const { _id } = req.query;

    const category = await ProductCategory.findById(_id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }
    removeFile(category.icon.split("/").pop());

    const products = await Product.find({
      category: mongoose.Types.ObjectId(category._id),
    });
    for (const product of products) {
      await axios.delete(
        `${
          req.headers.origin ?? process.env.NODE_ENV === "development"
            ? `http://${req.headers.host}`
            : `https://${req.headers.host}`
        }/api/admin/products/delete/${product._id}`
      );
    }
    await ProductCategory.findByIdAndDelete(_id);

    res
      .status(200)
      .json({ message: "Catégorie et produits associés sont supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

export default handler;
