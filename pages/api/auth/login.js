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
        message: "il n'y a aucun utilisateur avec cette addresse email !",
      });
    }
    const valid = bcrypt.compareSync(data.password, user.password);

    var token = null;

    token = jwt.sign({ id: user._id }, process.env.JWT_ADMIN_SECRET, {
      expiresIn: "1d",
    });

    if (valid) {
      const shop = await Shop.findById(user.shop);
      if (shop.verified) {
        res.status(200).json({
          _id: user._id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          token: token,
          shop: shop,
        });
      } else {
        res
          .status(401)
          .json({ message: "vérifiez votre compte pour se connecter !" });
      }
    } else {
      res.status(403).json({ message: "mot de passe incorrecte !" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
