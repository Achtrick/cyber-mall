import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";

const handler = nc();

handler.put(auth, async (req, res) => {
  const { shopId } = req.body;
  try {
    await connectDB();

    const shop = await Shop.findById(shopId);

    shop.pack = { type: "FREE", expiresIn: "" };

    await shop.save();

    res.status(200).json({
      message: `downgraded shop: ${shop.name} subscription`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
