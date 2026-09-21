import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";
import { ownsShop } from "../../../../utils/shared/auth";
import { fail, isObjectId } from "../../../../utils/shared/security";
import { cleanProduct } from "../../../../utils/shared/productInput";
import { removeFile } from "../../../../utils/shared/storage";

const handler = nc();

handler.put(auth, async (req, res) => {
  const data = req.body || {};
  if (!isObjectId(data._id)) {
    return res.status(400).json({ message: "Invalid product" });
  }

  try {
    await connectDB();
    const product = await Product.findById(data._id);
    // same answer for "missing" and "not yours" (no id probing)
    if (!product || !ownsShop(req, product.shop)) {
      return res.status(404).json({ message: "Product not found" });
    }

    // whitelisted + validated fields only (no mass assignment: shop can't change)
    const clean = await cleanProduct(data, String(product.shop), product.images);
    if (clean.error) return res.status(400).json({ message: clean.error });
    const { images, ...fields } = clean.value;

    if (images) {
      for (let image of product.images) {
        if (!images.includes(image)) await removeFile(image.split("/").pop());
      }
      product.images = images;
    }

    Object.assign(product, fields);
    await product.save();

    res.status(200).json({ message: "Product updated" });
  } catch (err) {
    fail(res, err, 400, "Could not update the product");
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
