import nc from "next-connect";
import connectDB from "../../../utils/connectDB";
import Shop from "../../../models/shop.model";

const handler = nc();

handler.post(async (req, res) => {
  const { shopName } = req.body;

  try {
    await connectDB();
    const shopInfo = await Shop.findOne({ name: shopName });
    shopInfo ? res.status(200).json(shopInfo) : res.status(404).json("error");
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
