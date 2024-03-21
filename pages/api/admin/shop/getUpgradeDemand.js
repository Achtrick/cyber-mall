import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import UpgradeDemand from "../../../../models/upgradeDemand.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const { shop } = req.body;

  try {
    const demand = await UpgradeDemand.findOne({ shop: shop });
    res.status(200).json(demand);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
