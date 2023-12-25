import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import Product from "../../../../models/product.model";
import auth from "../../../../middlewares/admin-auth";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    await Product.create(data);

    res.status(200).json({ message: "created product" });
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
