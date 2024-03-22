import nc from "next-connect";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";
import auth from "../../../middlewares/super-admin-auth";

const handler = nc();

handler.put(auth, async (req, res) => {
  const { _id } = req.body;
  try {
    await connectDB();

    const shop = await Shop.findById(_id);
    shop.banned = !shop.banned;
    await shop.save();

    res.status(200).json({
      message: `shop: ${shop.name} is now ${shop.banned ? "banned" : "active"}`,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
