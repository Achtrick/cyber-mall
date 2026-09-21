import nc from "next-connect";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { fail, rateLimit, sha256, str } from "../../../utils/shared/security";

const handler = nc();

handler.post(async (req, res) => {
  if (!rateLimit(req, res, { name: "check-reset", max: 30, windowMs: 15 * 60 * 1000 })) return;

  const token = str(req.body?.token, 200);
  if (!token) return res.status(403).json({ message: "Invalid or expired reset link" });

  try {
    await connectDB();
    const user = await User.findOne({
      resetToken: sha256(token),
      resetTokenExpires: { $gt: new Date() },
    }).select("_id");
    if (user) {
      res.status(200).json({ userId: user._id });
    } else {
      res.status(403).json({ message: "Invalid or expired reset link" });
    }
  } catch (error) {
    fail(res, error, 403, "Invalid or expired reset link");
  }
});

export default handler;
