// import nc from "next-connect";
// import connectDB from "../../../utils/connectDB";
// import User from "../../../models/user";
// import crypto from "crypto";

// const nodemailer = require("nodemailer");
// const token = crypto.randomBytes(10).toString("hex");

// const transporter = nodemailer.createTransport({
//   host: "ssl0.ovh.net",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.AUTH_ADMIN_EMAIL,
//     pass: process.env.AUTH_PASS,
//   },
// });

// const mailcss = {
//   background: `
//     style="background: #26336D;
//     border-radius: 5px;
//     padding-left: 10px;
//     padding-right: 10px;
//     padding-top: 5px;
//     padding-bottom: 5px;
//     color: white;"`,
//   body: `
//     style="background: white;
//     border-radius: 5px;
//     padding-left: 10px;
//     padding-right: 10px;
//     padding-top: 5px;
//     padding-bottom: 5px;
//     color: #09a43c;"`,
// };

// const handler = nc();

// handler.post(async (req, res) => {
//   await connectDB();
//   const email = req.body.email;
//   const url = `https://transportini.tn/reset-password/${token}`;
//   try {
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (user) {
//       await new Promise((resolve, reject) => {
//         transporter.verify(function (error, success) {
//           if (error) {
//             reject(error);
//           } else {
//             resolve(success);
//           }
//         });
//       });
//       await new Promise((resolve, reject) => {
//         // send mail
//         transporter.sendMail(
//           {
//             from: process.env.AUTH_ADMIN_EMAIL,
//             to: email,
//             replyTo: process.env.AUTH_ADMIN_EMAIL,
//             subject: "Récupération de votre mot de passe",
//             text: "Suivez ce lien pour changer votre mot de passe.",
//             html:
//               `<div ` +
//               mailcss.background +
//               `>
//               <div
//                 style="
//                   display: flex;
//                   width: 100%;
//                   justify-content: center;
//                   padding: 20px 0px;
//                 "
//               >
//               <iframe src="https://drive.google.com/file/d/1E0pDuQSsS8r55Fw071r59_CwA-8tCGnT/preview" width="90%" height="80px" allow="autoplay"/>
//               </div>
//               <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Suivez ce lien pour changer votre mot de passe:</h1>
//                 <div` +
//               mailcss.body +
//               `>
//                 <h3 style="font-size: 10px; font-wheight:300;">${url}</h3>
//             </div>`,
//           },
//           (err, info) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(info);
//             }
//           }
//         );
//       });

//       user.token = token;
//       await user.save();
//       res.status(200).json({
//         message: "Vérifiez votre boite mail pour le lien de récupération.",
//       });
//     } else {
//       res.status(404).json({
//         message: "il n'y a aucun compte avec cette adresse mail !",
//       });
//     }
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

// export default handler;
