import nc from "next-connect";
import Product from "../../../models/product.model";
import connectDB from "../../../utils/connectDB";
import { fail, isObjectId, str } from "../../../utils/shared/security";

const handler = nc();

handler.post(async (req, res) => {
  const { shop } = req.body || {};
  const slug = str(req.body?.slug, 260);
  // plain values only: objects like {"$ne": null} must never reach the query
  if (!isObjectId(shop) || !slug) {
    return res.status(400).json({ message: "Product link not found!" });
  }

  try {
    await connectDB();
    const product = await Product.findOne({ shop, slug }).populate({
      path: "category",
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(400).json({ message: "Product link not found!" });
    }
  } catch (err) {
    fail(res, err);
  }
});

export default handler;
