import mongoose from "mongoose";
import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import DomainDemand from "../../../models/domainDemand.model";
import Shop from "../../../models/shop.model";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { escapeHtml, fail, isHostname, isObjectId, str } from "../../../utils/shared/security";
import { mailcss, transporter } from "../../../utils/shared/mailer";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const shopId = req.body?.shopId;
  // bare hostname only: it drives host -> shop routing and goes into an email
  const domainName = str(req.body?.domainName, 253).toLowerCase().replace(/^www\./, "");
  if (!isObjectId(shopId) || !isHostname(domainName)) {
    return res.status(400).json({ message: "Invalid domain name" });
  }

  try {
    const shop = await Shop.findOne({ _id: shopId });
    const user = await User.findOne({
      shop: mongoose.Types.ObjectId(shopId),
    });
    shop.domainName = domainName;
    await shop.save();
    await DomainDemand.findOneAndRemove({
      shop: mongoose.Types.ObjectId(shopId),
    });
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: user.email,
          replyTo: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: "Domain name integration",
          text: "Your domain name integration has been completed successfully.",
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
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Domain name integration completed successfully.</h1>
              <div` +
            mailcss.body +
            `>
              <h3 style="font-size: 10px; font-wheight:300;">Congratulations, the integration of your domain name has been completed successfully.</h3>
              <hr/>
              <h3 style="font-size: 10px; font-wheight:300;">You can now access your site at: ${escapeHtml(domainName)}</h3>
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
      message: "Domain name updated.",
    });
  } catch (err) {
    return fail(res, err);
  }
});

export default handler;
