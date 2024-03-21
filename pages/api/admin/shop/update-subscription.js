import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import UpgradeDemand from "../../../../models/upgradeDemand.model";
import auth from "../../../../middlewares/admin-auth";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const data = req.body;

  try {
    await UpgradeDemand.create(data);

    res.status(200).json({
      message: "demande envoyée, terminez maintenant la transaction.",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
