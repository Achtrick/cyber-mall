import bcrypt from "bcryptjs";
import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import User from "../../../../models/user.model";
import connectDB from "../../../../utils/connectDB";
import {
  fail,
  isEmail,
  isPassword,
  rateLimit,
  str,
} from "../../../../utils/shared/security";

const handler = nc();

handler.put(auth, async (req, res) => {
  const userId = req.query.userId;
  // an account can only be edited by its owner (IDOR)
  if (userId !== req.auth.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  if (!rateLimit(req, res, { name: "update-account", key: req.auth.userId, max: 20, windowMs: 15 * 60 * 1000 })) return;

  const email = str(req.body?.email, 254).toLowerCase();
  const phone = str(req.body?.phone, 30);
  const address = str(req.body?.address, 300);
  const password = req.body?.password;

  if (email && !isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address!" });
  }
  if (password && !isPassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be between 8 and 72 characters" });
  }

  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Account not found" });
    if (email && email !== user.email) {
      if (await User.exists({ email })) {
        return res
          .status(403)
          .json({ message: "A user with this email address already exists!" });
      }
      user.email = email;
    }
    phone && (user.phone = phone);
    address && (user.address = address);
    password && (user.password = await bcrypt.hash(password, 10));
    await user.save();
    res.status(200).json({
      message: "Your account has been updated!",
      userInfo: { email: user.email, phone: user.phone, address: user.address },
    });
  } catch (err) {
    fail(res, err, 400, "Could not update the account");
  }
});

export default handler;
