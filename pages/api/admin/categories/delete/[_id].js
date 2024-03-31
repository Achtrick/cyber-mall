import nc from "next-connect";
import auth from "../../../../../middlewares/admin-auth";
import Product from "../../../../../models/product.model";
import ProductCategory from "../../../../../models/productCategory.model";
import connectDB from "../../../../../utils/connectDB";
import { removeFile } from "../../../../../utils/shared/removeFile";

const handler = nc();

handler.delete(auth, async (req, res) => {
  await connectDB();

  try {
    const { _id } = req.query;

    const category = await ProductCategory.findByIdAndDelete(_id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }
    removeFile(category.icon.split("/").pop());

    await Product.deleteMany({ category: _id });

    res
      .status(200)
      .json({ message: "Catégorie supprimée et produits associés" });
  } catch (err) {
    console.error("Erreur lors de la suppression de la catégorie :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

export default handler;
