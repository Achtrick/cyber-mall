import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from "../../../../models/user.model";
import connectDB from "../../../../utils/connectDB";
import {
  fail,
  isObjectId,
  isPassword,
  rateLimit,
  sha256,
  str,
} from "../../../../utils/shared/security";

const handler = nc();

// Password reset (unauthenticated): requires the one-time token from the
// recovery email, which must belong to the targeted user and not be expired.
handler.put(async (req, res) => {
  if (!rateLimit(req, res, { name: "change-password", max: 10, windowMs: 15 * 60 * 1000 })) return;

  const userId = req.query.userId;
  const token = str(req.body?.token, 200);
  const password = req.body?.password;

  if (!isObjectId(userId) || !token) {
    return res.status(403).json({ message: "Invalid or expired reset link" });
  }
  if (!isPassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be between 8 and 72 characters" });
  }

  try {
    await connectDB();
    const user = await User.findOne({
      _id: userId,
      resetToken: sha256(token),
      resetTokenExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(403).json({ message: "Invalid or expired reset link" });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined; // single use
    user.resetTokenExpires = undefined;
    user.passwordChangedAt = new Date(); // invalidates sessions issued before
    await user.save();
    res.status(200).json({ message: "Your password has been changed" });
  } catch (err) {
    fail(res, err, 400, "Could not change the password");
  }
});

export default handler;
