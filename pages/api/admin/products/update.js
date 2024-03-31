import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";
import { removeFile } from "../../../../utils/shared/removeFile";

const handler = nc();

handler.put(auth, async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    const product = await Product.findById(data._id);

    if (data.images) {
      for (let image of product.images) removeFile(image.split("/").pop());
      product.images = data.images;
    }

    product.category = data.category;
    product.designation = data.designation;
    product.description = data.description;
    product.price = data.price;
    product.discount = data.discount;
    product.qty = data.qty;

    await product.save();

    res.status(200).json({ message: "Produit Modifié" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};
