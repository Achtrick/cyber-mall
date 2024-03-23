import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import UpgradeDemand from "../../../../models/upgradeDemand.model";
import connectDB from "../../../../utils/connectDB";
import { mailcss, transporter } from "../../../../utils/shared/mailer";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const data = req.body;

  try {
    await UpgradeDemand.create(data);
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: process.env.AUTH_SUPERADMIN_EMAIL,
          replyTo: data.email,
          subject: "Dermande Premium",
          text: "Dermande Premium.",
          html:
            `<div ` +
            mailcss.background +
            `>
            <div
              style="
                display: flex;
                width: 100%;
                justify-content: center;
                padding: 20px 0px;
              "
            >
            <img style="object-fit: contain;" alt="Cyber-Mall" title="Cyber-Mall" src="https://cyber-mall.tn/images/logo.png" width="70%" height="80px">
            </div>
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Je veux activer Premium pour mon shop.</h1>
              <div` +
            mailcss.body +
            `>
              <h3 style="font-size: 10px; font-wheight:300;">Nom D'utilisateur: ${data.userName}</h3>
              <h3 style="font-size: 10px; font-wheight:300;">Téléphone: ${data.phone}</h3>
              <hr/>
              <h3 style="font-size: 10px; font-wheight:300;">Offre: ${data.period}</h3>
          </div>`,
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });

    res.status(200).json({
      message: "demande envoyée, terminez maintenant la transaction.",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
