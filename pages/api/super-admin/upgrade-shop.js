import moment from "moment";
import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import Shop from "../../../models/shop.model";
import UpgradeDemand from "../../../models/upgradeDemand.model";
import connectDB from "../../../utils/connectDB";
import { mailcss, transporter } from "../../../utils/shared/mailer";

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
    const demand = await UpgradeDemand.findByIdAndRemove(demandId);
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: demand.email,
          replyTo: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: "Cyber-Mall Premium",
          text: "Votre Abonnement PREMIUM est Activé.",
          html:
            `<div ` +
            mailcss.background +
            `>
            <div
              style="
                display: flex;
                width: 100%;
                justify-content: center;
                padding: 20px 0px;
              "
            >
            <img style="object-fit: contain;" alt="Cyber-Mall" title="Cyber-Mall" src="https://cyber-mall.tn/images/logo.png" width="70%" height="80px">
            </div>
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Félicitation Votre Abonnement PREMIUM est Activé</h1>
              <div` +
            mailcss.body +
            `>
              <h3 style="font-size: 10px; font-wheight:300;">Votre abonnement est valide jusqu'à ${moment(
                shop.pack.expiresIn
              ).format("DD-MM-YYYY")} ! reconnectez vous pour refraichir !</h3>
          </div>`,
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });

    res.status(200).json({
      message: `upgraded shop: ${shop.name} subscription`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
