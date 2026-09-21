import nc from "next-connect";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { mailcss, transporter } from "../../../utils/shared/mailer";
import {
  fail,
  getSiteUrl,
  isEmail,
  newToken,
  rateLimit,
  str,
} from "../../../utils/shared/security";

const handler = nc();

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

handler.post(async (req, res) => {
  const email = str(req.body?.email, 254).toLowerCase();

  if (!rateLimit(req, res, { name: "recover-ip", max: 10, windowMs: 60 * 60 * 1000 })) return;
  if (!rateLimit(req, res, { name: "recover-email", key: email, max: 3, windowMs: 60 * 60 * 1000 })) return;

  // same answer whether the account exists or not (no user enumeration)
  const okResponse = () =>
    res.status(200).json({
      message: "Check your mailbox for the recovery link.",
    });

  if (!isEmail(email)) return okResponse();

  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return okResponse();

    // a fresh, unguessable token per request; only its hash is stored
    const token = newToken();
    const url = `${getSiteUrl(req)}/reset-password/${token.raw}`;

    user.resetToken = token.hash;
    user.resetTokenExpires = new Date(Date.now() + RESET_TTL_MS);
    await user.save();

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: user.email,
          replyTo: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: "Reset your password",
          text: "Follow this link to change your password (valid for 1 hour).",
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
              <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Follow this link to change your password:</h1>
                <div` +
            mailcss.body +
            `>
                <h3 style="font-size: 10px; font-wheight:300;">${url}</h3>
                <h3 style="font-size: 10px; font-wheight:300;">This link is valid for 1 hour.</h3>
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

    return okResponse();
  } catch (err) {
    return fail(res, err, 400, "Could not send the recovery email, please try again later.");
  }
});

export default handler;
