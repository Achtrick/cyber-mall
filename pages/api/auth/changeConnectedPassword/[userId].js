import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";
import auth from "../../../../middlewares/auth";

const handler = nc();

handler.put(auth, async (req, res) => {
  await connectDB();
  const userId = req.query.userId;
  const password = req.body.password;
  var salt = bcrypt.genSaltSync(10);
  try {
    const user = await User.findById(userId);
    user.password = bcrypt.hashSync(password, salt);
    user.token = "";
    await user.save();
    res.status(200).json({ message: "votre mot de passe a été changée" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

export default handler;
