import nc from "next-connect";
import ProductCategory from "../../../../models/productCategory.model";
import connectDB from "../../../../utils/connectDB";
import { fail, isObjectId } from "../../../../utils/shared/security";

const handler = nc();

// Public on purpose: the storefront lists a shop's categories.
handler.post(async (req, res) => {
  const shop = req.body?.shop;
  // must be a plain id string, never an object such as {"$ne": null}
  if (!isObjectId(shop)) {
    return res.status(400).json({ message: "Invalid shop" });
  }
  try {
    await connectDB();
    const categories = await ProductCategory.find({ shop });

    res.status(200).json(categories);
  } catch (err) {
    fail(res, err);
  }
});

export default handler;
