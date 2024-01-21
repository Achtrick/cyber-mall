// import nc from "next-connect";
// import User from "../../../models/user.model";
// import connectDB from "../../../utils/connectDB";

// const handler = nc();

// handler.post(async (req, res) => {
//   await connectDB();
//   try {
//     const user = await User.findOne({ token: { $eq: req.body.token } });
//     if (user) {
//       res.status(200).json({ userId: user._id });
//     } else {
//       res.status(403).json({ message: "error" });
//     }
//   } catch (error) {
//     res.status(403).json(error);
//   }
// });

// export default handler;
