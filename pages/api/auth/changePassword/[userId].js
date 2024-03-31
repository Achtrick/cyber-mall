import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from "../../../../models/user.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.put(async (req, res) => {
  await connectDB();
  const userId = req.query.userId;
  const password = req.body.password;
  var salt = bcrypt.genSaltSync(10);
  try {
    const user = await User.findById(userId);
    user.password = bcrypt.hashSync(password, salt);
    user.token = "";
    await user.save();
    res.status(200).json({ message: "Votre mot de passe a été changée" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

export default handler;
