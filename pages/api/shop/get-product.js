import mongoose from "mongoose";
import nc from "next-connect";
import Product from "../../../models/product.model";
import connectDB from "../../../utils/connectDB";

const handler = nc();

handler.post(async (req, res) => {
  const { shop, slug } = req.body;
  const query = {
    shop: mongoose.Types.ObjectId(shop),
    slug: slug,
  };

  try {
    await connectDB();
    const product = await Product.findOne(query).populate({ path: "category" });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(400).json({ message: "Lien de produit introuvable !" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
