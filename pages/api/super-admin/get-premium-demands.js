import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import UpgradeDemand from "../../../models/upgradeDemand.model";
import connectDB from "../../../utils/connectDB";
import { fail, num, searchRegexes } from "../../../utils/shared/security";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { searchTerm } = req.body || {};
  const pageNumber = num(req.body?.page, { min: 1, max: 100000, def: 1, int: true });
  const query = {};
  const terms = searchRegexes(searchTerm).map((r) => ({ userName: r }));
  if (terms.length) query.$or = terms;
  try {
    await connectDB();
    const demands = await UpgradeDemand.find(query)
      .populate({ path: "shop" })
      .sort({ createdAt: -1 })
      .limit(20)
      .skip((pageNumber - 1) * 20);
    const totalDemands = await UpgradeDemand.countDocuments(query);
    const count = Math.ceil(totalDemands / 20);
    res.status(200).json({ demands: demands, count: count });
  } catch (err) {
    return fail(res, err);
  }
});

export default handler;
