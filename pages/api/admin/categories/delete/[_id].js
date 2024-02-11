import nc from "next-connect";
import connectDB from "../../../../../utils/connectDB";
import ProductCategory from "../../../../../models/productCategory.model";
import Product from "../../../../../models/product.model";
import auth from "../../../../../middlewares/admin-auth";
import { removeFile } from "../../../../../utils/shared/removeFile";

const handler = nc();

handler.delete(auth, async (req, res) => {
  await connectDB();

  try {
    const { _id } = req.query;

    const category = await ProductCategory.findByIdAndDelete(_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    removeFile(category.icon.split("/").pop());

    await Product.deleteMany({ category: _id });

    res
      .status(200)
      .json({ message: "Deleted category and associated products" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default handler;
