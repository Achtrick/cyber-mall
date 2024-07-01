import nc from "next-connect";
import Shop from "../../models/shop.model";
import connectDB from "../../utils/connectDB";

const handler = nc();

handler.post(async (req, res) => {
  const { activityDomain, page } = req.body;
  try {
    await connectDB();
    const shops = await Shop.find({
      activityDomain: activityDomain,
      banned: false,
      verified: true,
    })
      .sort({ "pack.type": -1 })
      .limit(1)
      .skip((page - 1) * 1);
    const totalShops = await Shop.countDocuments({
      activityDomain: activityDomain,
      banned: false,
      verified: true,
    });
    const count = Math.ceil(totalShops / 1);
    res.status(200).json({ shops: shops, count: count });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
