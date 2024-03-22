import moment from "moment";
import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import Shop from "../../../models/shop.model";
import UpgradeDemand from "../../../models/upgradeDemand.model";
import connectDB from "../../../utils/connectDB";

const handler = nc();

handler.put(auth, async (req, res) => {
  const { shopId, demandId, period } = req.body;
  try {
    await connectDB();

    const monthsToAdd = parseInt(period.split(" ")[0]);

    const shop = await Shop.findById(shopId);

    if (shop.pack.expiresIn !== "") {
      shop.pack = {
        type: "PREMIUM",
        expiresIn: moment(shop.pack.expiresIn)
          .add(monthsToAdd, "month")
          .toISOString(),
      };
    } else {
      shop.pack = {
        type: "PREMIUM",
        expiresIn: moment().add(monthsToAdd, "month").toISOString(),
      };
    }
    await shop.save();
    await UpgradeDemand.findByIdAndRemove(demandId);

    res.status(200).json({
      message: `upgraded shop: ${shop.name} subscription`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
