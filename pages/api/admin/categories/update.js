import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import ProductCategory from "../../../../models/productCategory.model";
import connectDB from "../../../../utils/connectDB";
import { ownsShop } from "../../../../utils/shared/auth";
import { cleanImage, fail, isObjectId, str } from "../../../../utils/shared/security";
import { removeFile } from "../../../../utils/shared/storage";

const handler = nc();

handler.put(auth, async (req, res) => {
  const data = req.body || {};
  if (!isObjectId(data._id)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    await connectDB();
    const category = await ProductCategory.findById(data._id);
    // same answer for "missing" and "not yours" (no id probing)
    if (!category || !ownsShop(req, category.shop)) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (data.icon) {
      const icon = cleanImage(data.icon, String(category.shop), [category.icon]);
      if (!icon) return res.status(400).json({ message: "Invalid image" });
      if (icon !== category.icon) {
        await removeFile(category.icon.split("/").pop());
        category.icon = icon;
      }
    }

    category.name = str(data.name, 100) || category.name;
    category.description = str(data.description, 1000);

    await category.save();

    res.status(200).json({ message: "Category updated" });
  } catch (err) {
    fail(res, err, 400, "Could not update the category");
  }
});

export default handler;
