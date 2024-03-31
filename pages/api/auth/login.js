import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nc from "next-connect";
import Shop from "../../../models/shop.model";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";

const handler = nc();

handler.post(async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      return res.status(403).json({
        message: "Il n'y a aucun utilisateur avec cette addresse email !",
      });
    }
    const valid = bcrypt.compareSync(data.password, user.password);

    if (valid) {
      if (user.role === "ADMIN") {
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
            token: jwt.sign({ id: user._id }, process.env.JWT_ADMIN_SECRET, {
              expiresIn: "1d",
            }),
            shop: shop,
          });
        } else {
          res
            .status(401)
            .json({ message: "Vérifiez votre compte pour se connecter !" });
        }
      } else {
        res.status(200).json({
          _id: user._id,
          role: user.role,
          email: user.email,
          token: jwt.sign(
            { id: user._id },
            process.env.JWT_SUPER_ADMIN_SECRET,
            {
              expiresIn: "1d",
            }
          ),
        });
      }
    } else {
      res.status(403).json({ message: "Mot de passe incorrecte !" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
