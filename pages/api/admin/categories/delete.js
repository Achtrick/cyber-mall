import mongoose from "mongoose";
import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";
import ProductCategory from "../../../../models/productCategory.model";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { ownsShop } from "../../../../utils/shared/auth";
import { fail, isObjectId } from "../../../../utils/shared/security";
import { removeFile } from "../../../../utils/shared/storage";
import { deleteProduct } from "../products/delete";

const handler = nc();

handler.post(auth, async (req, res) => {
  const categoryId = req.body?.categoryId;
  if (!isObjectId(categoryId)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    await connectDB();
    // only the owning shop's admin may delete a category (IDOR)
    const category = await ProductCategory.findById(categoryId).select("shop");
    if (!category || !ownsShop(req, category.shop)) {
      return res.status(404).json({ message: "Category not found" });
    }
    await deleteCategory(categoryId);

    res
      .status(200)
      .json({ message: "Category and its associated products deleted" });
  } catch (err) {
    fail(res, err, 500, "Could not delete the category");
  }
});

export const deleteCategory = async (categoryId) => {
  const category = await ProductCategory.findById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }
  const shop = await Shop.findById(mongoose.Types.ObjectId(category.shop));
  await removeFile(category.icon.split("/").pop());

  const products = await Product.find({
    category: mongoose.Types.ObjectId(category._id),
  });
  for (const product of products) {
    await deleteProduct(product._id);
  }
  await ProductCategory.findByIdAndDelete(categoryId);
  if (!shop) return;
  shop.architecture = {
    ...shop.architecture,
    home: {
      ...shop.architecture.home,
      categoriesComponent: {
        ...shop.architecture.home.categoriesComponent,
        selectedCategoriesIds:
          shop.architecture.home.categoriesComponent.selectedCategoriesIds.filter(
            (id) => String(id) !== String(categoryId)
          ),
      },
    },
  };

  await shop.save();
};

export default handler;
