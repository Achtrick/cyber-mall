import nc from "next-connect";
import connectDB from "../../../utils/connectDB";
import User from "../../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Shop from "../../../models/shop.model";

const handler = nc();

handler.post(async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      return res.status(403).json({
        message: "il n'y a aucun utilisateur avec cette adresse email !",
      });
    }
    const valid = bcrypt.compareSync(data.password, user.password);

    var token = null;

    if (user.role === "ADMIN") {
      token = jwt.sign({ id: user._id }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: "30d",
      });
    } else {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
    }

    if (valid) {
      if (user.role === "ADMIN") {
        const shop = await Shop.findById(user.shop);
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
      } else if (user.role === "CLIENT") {
        res.status(200).json({
          _id: user._id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          adress: user.adress,
          token: token,
        });
      }
    } else {
      res.status(403).json({ message: "mot de passe incorrecte !" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
