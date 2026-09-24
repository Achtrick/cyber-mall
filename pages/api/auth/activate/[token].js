import nc from "next-connect";
import Shop from "../../../../models/shop.model";
import User from "../../../../models/user.model";
import connectDB from "../../../../utils/connectDB";
import { fail, getSiteUrl, rateLimit, sha256, str } from "../../../../utils/shared/security";

const handler = nc();

handler.get(async (req, res) => {
  if (!rateLimit(req, res, { name: "activate", max: 30, windowMs: 15 * 60 * 1000 })) return;
  await connectDB();
  const token = str(req.query.token, 200);
  const siteUrl = getSiteUrl(req);

  const successPage = `<html style="background-color: #101820; text-align: center;">
      <div style="width: calc(100vw - 16px); height: calc(100vh - 16px); display: flex; flex-direction: column; align-items:center; justify-content:center;">
        <img alt="cyber-mall" src="${siteUrl}/images/logo.png" style="width: 300px" />
        <h1 style="font-size: 45px; color:white;">Congratulations! Your shop is now activated!</h1>
        <button style="border: none; background-color: white; color: black; padding: 5px 10px;"><a style="text-decoration: none; color: black; font-size: 35px;" href="/login">Log in</a></button>
        </div>
    </html>`;

  const errorPage = `<html style="background-color: #101820; text-align: center;">
      <div style="width: calc(100vw - 16px); height: calc(100vh - 16px); display: flex; flex-direction: column; align-items:center; justify-content:center;">
        <img alt="cyber-mall" src="${siteUrl}/images/logo.png" style="width: 300px" />
        <h1 style="font-size: 45px; color:white;">Error while activating your shop, please contact us for more information.</h1>
        <button style="border-radius: 15px; border: none; background-color: white; color: black; padding: 5px 10px;"><a style="text-decoration: none; color: black; font-size: 35px;" href="/contact">Contact us</a></button>
        </div>
    </html>`;

  try {
    // tokens are stored hashed; legacy accounts still hold the raw 20 char token
    const user = token
      ? await User.findOne({ token: token.length === 20 ? token : sha256(token) })
      : null;
    const shop = user?.shop ? await Shop.findById(user.shop) : null;

    if (user && shop) {
      shop.verified = true;
      user.token = "";
      await user.save();
      await shop.save();
      res.send(successPage);
    } else {
      res.send(errorPage);
    }
  } catch (err) {
    fail(res, err, 400, "Activation failed");
  }
});

export default handler;
