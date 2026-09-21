import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nc from "next-connect";
import Shop from "../../../models/shop.model";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { fail, isEmail, rateLimit, str } from "../../../utils/shared/security";

const handler = nc();

// compared against when the email is unknown so both paths take similar time
let dummyHash;

handler.post(async (req, res) => {
  const email = str(req.body?.email, 254).toLowerCase();
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  const window = 15 * 60 * 1000;
  if (!rateLimit(req, res, { name: "login-ip", max: 30, windowMs: window })) return;
  if (!rateLimit(req, res, { name: "login-email", key: email, max: 10, windowMs: window })) return;

  if (!isEmail(email) || !password || password.length > 200) {
    return res.status(403).json({ message: "Incorrect email or password!" });
  }

  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      dummyHash = dummyHash || bcrypt.hashSync("cyber-mall-dummy", 10);
      await bcrypt.compare(password, dummyHash);
      return res.status(403).json({ message: "Incorrect email or password!" });
    }

    const valid = await bcrypt.compare(password, user.password || "");
    if (!valid) {
      return res.status(403).json({ message: "Incorrect email or password!" });
    }

    if (user.role === "ADMIN") {
      const shop = user.shop ? await Shop.findById(user.shop) : null;
      if (!shop) {
        return res.status(403).json({ message: "Incorrect email or password!" });
      }
      if (!shop.verified) {
        return res.status(401).json({ message: "Verify your account to log in!" });
      }
      return res.status(200).json({
        _id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        token: jwt.sign({ id: user._id }, process.env.JWT_ADMIN_SECRET, {
          expiresIn: "7d",
          algorithm: "HS256",
        }),
        shop: shop,
      });
    }

    if (user.role === "SUPER-ADMIN") {
      return res.status(200).json({
        _id: user._id,
        role: user.role,
        email: user.email,
        token: jwt.sign({ id: user._id }, process.env.JWT_SUPER_ADMIN_SECRET, {
          expiresIn: "1d",
          algorithm: "HS256",
        }),
      });
    }

    return res.status(403).json({ message: "Incorrect email or password!" });
  } catch (err) {
    return fail(res, err, 400, "Login failed, please try again.");
  }
});

export default handler;
