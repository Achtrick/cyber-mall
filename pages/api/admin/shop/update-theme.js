import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import Shop from "../../../../models/shop.model";
import auth from "../../../../middlewares/admin-auth";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const data = req.body;

  try {
    const shop = await Shop.findOne({ _id: data.shopId });
    shop.settings = data.settings;
    await shop.save();

    res.status(200).json({ message: "updated theme" });
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
