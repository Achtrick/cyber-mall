import nc from "next-connect";
import connectDB from "../../../utils/connectDB";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handler = nc();

handler.post(async (req, res) => {
  await connectDB();
  const data = req.body;
  try {
    const exists = await User.findOne({ email: data.email.toLowerCase() });
    if (!exists) {
      return res.status(403).json({
        message: "il n'y a aucun utilisateur avec cette adresse email !",
      });
    }
    const valid = bcrypt.compareSync(data.password, exists.password);

    var token = null;

    if (exists.role === "ADMIN") {
      token = jwt.sign({ id: exists._id }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: "30d",
      });
    } else {
      token = jwt.sign({ id: exists._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
    }

    if (valid) {
      if (exists.isActive) {
        res.status(200).json({
          _id: exists._id,
          role: exists.role,
          name: exists.name,
          email: exists.email,
          avatar: exists.avatar,
          phone: exists.phone,
          sex: exists.sex,
          type: exists.type,
          location: exists.location,
          gerant: exists.gerant,
          companyName: exists.companyName,
          mf: exists.mf,
          description: exists.description,
          isActive: exists.isActive,
          token: token,
        });
      } else {
        res.status(403).json({
          message:
            "votre compte est désactivé svp contacter l'administration !",
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
