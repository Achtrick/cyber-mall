import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";

const handler = nc();

handler.put(auth, async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    await Product.findOneAndUpdate({ _id: data._id }, data);

    res.status(200).json({ message: "product catgegory" });
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
