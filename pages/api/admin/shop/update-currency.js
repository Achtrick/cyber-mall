import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const { shopId, currency } = req.body;
  try {
    const shop = await Shop.findOne({ _id: shopId });
    shop.currency = currency;
    await shop.save();

    res.status(200).json({ message: "Devise modifiée", shopInfo: shop });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
