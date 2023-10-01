import nc from "next-connect";
import connectDB from "../../../utils/connectDB";
import User from "../../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handler = nc();

handler.post(async (req, res) => {
  var salt = bcrypt.genSaltSync(10);
  await connectDB();

  const data = req.body;

  try {
    const exists = await User.findOne({ email: data.email.toLowerCase() });
    if (exists) {
      return res
        .status(403)
        .json({ message: "il y a un utilisateur avec cette adresse email !" });
    }
    const user = await User.create({
      ...data,
      role: "CLIENT",
      email: data.email.toLowerCase(),
      password: bcrypt.hashSync(data.password, salt),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      _id: user._id,
      role: user.role,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      phone: user.phone,
      adress: user.adress,
      token: token,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
