import mongoose from "mongoose";
import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import DomainDemand from "../../../../models/domainDemand.model";
import Shop from "../../../../models/shop.model";
import User from "../../../../models/user.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { escapeHtml, fail, getSiteUrl, isHostname, rateLimit, str } from "../../../../utils/shared/security";
import { mailcss, transporter } from "../../../../utils/shared/mailer";

const handler = nc();

handler.post(auth, async (req, res) => {
  // always the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, req.body?.shopId);
  if (!shopId) return;
  if (!rateLimit(req, res, { name: "domain-demand", key: req.auth.userId, max: 10, windowMs: 60 * 60 * 1000 })) return;
  // bare hostname only: it ends up in an email and later in host -> shop routing
  const domainName = str(req.body?.domainName, 253).toLowerCase().replace(/^www\./, "");
  if (!isHostname(domainName)) {
    return res.status(400).json({ message: "Invalid domain name" });
  }

  const siteUrl = getSiteUrl(req);

  try {
    await connectDB();
    const shop = await Shop.findOne({ _id: shopId });
    const user = await User.findOne({
      shop: mongoose.Types.ObjectId(shopId),
    });
    if (!shop || !user) return res.status(404).json({ message: "Shop not found" });
    const demand = await DomainDemand.findOne({
      shop: mongoose.Types.ObjectId(shopId),
    });
    if (demand) {
      await DomainDemand.findOneAndRemove({
        shop: mongoose.Types.ObjectId(shopId),
      });
    }
    await DomainDemand.create({
      userName: user.firstName + user.lastName,
      phone: user.phone,
      email: user.email,
      domainName: domainName,
      shop: mongoose.Types.ObjectId(shopId),
    });
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: "Domain name integration request",
          text: "Domain name integration request.",
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
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">I want to change my domain name.</h1>
              <div` +
            mailcss.body +
            `>
              <h3 style="font-size: 10px; font-wheight:300;">Username: ${escapeHtml(
                user.firstName + " " + user.lastName
              )}</h3>
              <h3 style="font-size: 10px; font-wheight:300;">Shop: ${escapeHtml(shop.name)}</h3>
              <h3 style="font-size: 10px; font-wheight:300;">Phone: ${escapeHtml(user.phone)}</h3>
              <hr/>
              <h3 style="font-size: 10px; font-wheight:300;">Domain name: ${escapeHtml(domainName)}</h3>
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
      message:
        "Domain name updated, our technicians will call you as soon as possible.",
    });
  } catch (err) {
    fail(res, err, 400, "Could not send the request");
  }
});

export default handler;
