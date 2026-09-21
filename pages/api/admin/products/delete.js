import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";
import { ownsShop } from "../../../../utils/shared/auth";
import { fail, isObjectId } from "../../../../utils/shared/security";
import { removeFile } from "../../../../utils/shared/storage";

const handler = nc();

handler.post(auth, async (req, res) => {
  const productId = req.body?.productId;
  if (!isObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product" });
  }
  try {
    await connectDB();
    // only the owning shop's admin may delete a product (IDOR)
    const product = await Product.findById(productId).select("shop");
    if (!product || !ownsShop(req, product.shop)) {
      return res.status(404).json({ message: "Product not found" });
    }
    await deleteProduct(productId);

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    fail(res, err, 400, "Could not delete the product");
  }
});

export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) return;

  for (let image of product.images) {
    await removeFile(image.split("/").pop());
  }
};

export default handler;
