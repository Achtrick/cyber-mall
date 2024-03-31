import nc from "next-connect";
import { transporter } from "../../utils/shared/mailer";

const handler = nc();

handler.post(async (req, res) => {
  const { message, email, subject, phone } = req.body;
  try {
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(
        {
          replyTo: email,
          from: email,
          to: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: subject,
          text: `Message: ${message}\n\nPhone: ${phone}`,
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
      message:
        "Nous avons bien reçu votre message et nous vous contacterons dès que possible.",
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default handler;
