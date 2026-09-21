import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { fail } from "../../../../utils/shared/security";
import { cleanProduct } from "../../../../utils/shared/productInput";

const handler = nc();

handler.post(auth, async (req, res) => {
  const data = req.body || {};
  // the shop is the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, data.shop);
  if (!shopId) return;

  try {
    await connectDB();
    // whitelisted + validated fields only (no mass assignment)
    const clean = await cleanProduct(data, shopId);
    if (clean.error) return res.status(400).json({ message: clean.error });
    await Product.create({ ...clean.value, shop: shopId });

    res.status(200).json({ message: "Product added" });
  } catch (err) {
    fail(res, err, 400, "Could not add the product");
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
