import nc from "next-connect";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";
import { fail, isObjectId } from "../../../utils/shared/security";
import auth from "../../../middlewares/super-admin-auth";

const handler = nc();

handler.put(auth, async (req, res) => {
  const _id = req.body?._id;
  if (!isObjectId(_id)) return res.status(400).json({ message: "Invalid shop" });
  try {
    await connectDB();

    const shop = await Shop.findById(_id);
    shop.banned = !shop.banned;
    await shop.save();

    res.status(200).json({
      message: `shop: ${shop.name} is now ${shop.banned ? "banned" : "active"}`,
    });
  } catch (err) {
    return fail(res, err);
  }
});

export default handler;
