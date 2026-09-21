import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import UpgradeDemand from "../../../../models/upgradeDemand.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { fail } from "../../../../utils/shared/security";

const handler = nc();

handler.post(auth, async (req, res) => {
  // always the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, req.body?.shop);
  if (!shopId) return;

  try {
    await connectDB();
    const demand = await UpgradeDemand.findOne({ shop: shopId });
    res.status(200).json(demand);
  } catch (err) {
    fail(res, err);
  }
});

export default handler;
