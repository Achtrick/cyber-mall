import nc from "next-connect";
import connectDB from "../../../utils/connectDB";
import User from "../../../models/user.model";
import Shop from "../../../models/shop.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handler = nc();

handler.post(async (req, res) => {
  var salt = bcrypt.genSaltSync(10);
  await connectDB();

  const data = req.body;

  try {
    const userExists = await User.findOne({ email: data.email.toLowerCase() });
    if (userExists) {
      return res
        .status(403)
        .json({ message: "il y a un utilisateur avec cette adresse email !" });
    }

    const shopExists = await Shop.findOne({
      shopName: data.shopName.toLowerCase(),
    });

    if (shopExists) {
      return res.status(403).json({ message: "il y a un shop avec ce nom !" });
    }

    const shop = await Shop.create({
      name: data.shopName.toLowerCase(),
    });

    const user = await User.create({
      ...data,
      role: "ADMIN",
      email: data.email.toLowerCase(),
      password: bcrypt.hashSync(data.password, salt),
      shop: shop._id,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      _id: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      adress: user.adress,
      token: token,
      shop: shop,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
