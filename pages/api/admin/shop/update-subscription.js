import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import UpgradeDemand from "../../../../models/upgradeDemand.model";
import User from "../../../../models/user.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { escapeHtml, fail, rateLimit, singleLine } from "../../../../utils/shared/security";
import { mailcss, transporter } from "../../../../utils/shared/mailer";

const handler = nc();

const PERIODS = ["1 Month", "3 Months", "6 Months", "12 Months"];

handler.post(auth, async (req, res) => {
  // always the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, req.body?.shop);
  if (!shopId) return;
  if (!rateLimit(req, res, { name: "premium-demand", key: req.auth.userId, max: 5, windowMs: 60 * 60 * 1000 })) return;

  const period = PERIODS.find((p) => p === req.body?.period);
  if (!period) return res.status(400).json({ message: "Invalid offer" });

  try {
    await connectDB();
    // identity comes from the account, not from the request body
    const account = await User.findById(req.auth.userId);
    if (!account) return res.status(404).json({ message: "Account not found" });
    const data = {
      orderNumber:
        singleLine(req.body?.orderNumber, 60) ||
        String(Math.floor(100000 + Math.random() * 900000)),
      userName: singleLine(`${account.firstName ?? ""} ${account.lastName ?? ""}`, 120),
      phone: singleLine(account.phone, 30),
      email: account.email,
      shop: shopId,
      period,
    };
    await UpgradeDemand.create(data);
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
      // send mail
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: process.env.AUTH_SUPERADMIN_EMAIL,
          replyTo: data.email,
          subject: "Premium request",
          text: "Premium request.",
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
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">I want to activate Premium for my shop.</h1>
              <div` +
            mailcss.body +
            `>
              <h3 style="font-size: 10px; font-wheight:300;">Username: ${escapeHtml(data.userName)}</h3>
              <h3 style="font-size: 10px; font-wheight:300;">Phone: ${escapeHtml(data.phone)}</h3>
              <hr/>
              <h3 style="font-size: 10px; font-wheight:300;">Offer: ${escapeHtml(data.period)}</h3>
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
      message: "Request sent, now complete the transaction.",
    });
  } catch (err) {
    fail(res, err, 400, "Could not send the request");
  }
});

export default handler;
