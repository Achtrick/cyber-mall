import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";
import { fail, isObjectId } from "../../../utils/shared/security";

const handler = nc();

handler.put(auth, async (req, res) => {
  const shopId = req.body?.shopId;
  if (!isObjectId(shopId)) return res.status(400).json({ message: "Invalid shop" });
  try {
    await connectDB();

    const shop = await Shop.findById(shopId);

    shop.pack = { type: "FREE", expiresIn: "" };

    await shop.save();

    res.status(200).json({
      message: `downgraded shop: ${shop.name} subscription`,
    });
  } catch (err) {
    return fail(res, err);
  }
});

export default handler;
