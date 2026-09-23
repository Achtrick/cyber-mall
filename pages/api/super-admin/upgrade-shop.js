import moment from "moment";
import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import Shop from "../../../models/shop.model";
import UpgradeDemand from "../../../models/upgradeDemand.model";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { escapeHtml, fail, getSiteUrl, isObjectId, num, str } from "../../../utils/shared/security";
import { mailcss, transporter } from "../../../utils/shared/mailer";

const handler = nc();

handler.put(auth, async (req, res) => {
  const { shopId, demandId } = req.body || {};
  const period = str(req.body?.period, 30);
  // "<n> Month(s)" with a sane n
  const monthsToAdd = num(period.split(" ")[0], { min: 0, max: 36, int: true });
  if (!isObjectId(shopId) || !isObjectId(demandId) || monthsToAdd < 1) {
    return res.status(400).json({ message: "Invalid request" });
  }
  try {
    await connectDB();

    const shop = await Shop.findById(shopId);

    // extend from the current expiry date, or from today when there is none or it has passed
    const base =
      shop.pack.expiresIn && moment(shop.pack.expiresIn).isAfter(moment())
        ? moment(shop.pack.expiresIn)
        : moment();
    shop.pack = {
      type: "PREMIUM",
      expiresIn: base.add(monthsToAdd, "month").toISOString(),
    };
    await shop.save();
    const demand = await UpgradeDemand.findByIdAndRemove(demandId);
    const to =
      demand?.email || (await User.findOne({ shop: shop._id }))?.email;
    if (!to) {
      return res.status(200).json({
        message: `upgraded shop: ${shop.name} subscription`,
      });
    }
    // the shop is already upgraded: a mail failure must not fail the request
    const siteUrl = getSiteUrl(req);
    await new Promise((resolve) => {
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: to,
          replyTo: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: "Cyber-Mall Premium",
          text: "Your PREMIUM subscription is activated.",
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
            <img style="object-fit: contain;" alt="Cyber-Mall" title="Cyber-Mall" src="${siteUrl}/images/logo.png" width="70%" height="80px">
            </div>
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Congratulations, your PREMIUM subscription is activated</h1>
              <div` +
            mailcss.body +
            `>
              <h3 style="font-size: 10px; font-wheight:300;">Your subscription is valid until ${moment(
                shop.pack.expiresIn
              ).format("DD-MM-YYYY")} ! Please log in again to refresh your account.</h3>
          </div>`,
        },
        (err, info) => {
          if (err) console.error("upgrade mail failed", err);
          resolve(info);
        }
      );
    });

    res.status(200).json({
      message: `upgraded shop: ${shop.name} subscription`,
    });
  } catch (err) {
    return fail(res, err);
  }
});

export default handler;
