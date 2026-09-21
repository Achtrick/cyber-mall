import nc from "next-connect";
import Shop from "../../models/shop.model";
import connectDB from "../../utils/connectDB";
import { fail, num, str } from "../../utils/shared/security";

const handler = nc();

handler.post(async (req, res) => {
  // plain values only: objects like {"$ne": null} must never reach the query
  const activityDomain = str(req.body?.activityDomain, 100);
  const page = num(req.body?.page, { min: 1, max: 100000, def: 1, int: true });
  if (!activityDomain) return res.status(200).json({ shops: [], count: 0 });
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
    fail(res, err);
  }
});

export default handler;
