import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import User from "../../../../models/user.model";
import bcrypt from "bcryptjs";

const handler = nc();

handler.put(async (req, res) => {
  await connectDB();
  const userId = req.query.userId;
  const { email, phone, address, password } = req.body;
  var salt = bcrypt.genSaltSync(10);
  try {
    const user = await User.findById(userId);
    email && (user.email = email);
    phone && (user.phone = phone);
    address && (user.address = address);
    password && (user.password = bcrypt.hashSync(password, salt));
    await user.save();
    res.status(200).json({
      message: "votre compte est modifié !",
      userInfo: { email: user.email, phone: user.phone, address: user.address },
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

export default handler;
