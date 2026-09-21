import nc from "next-connect";
import { transporter } from "../../utils/shared/mailer";
import { isEmail, rateLimit, singleLine, str } from "../../utils/shared/security";

const handler = nc();

handler.post(async (req, res) => {
  // public endpoint that sends email: throttle it to limit spam / mail abuse
  if (!rateLimit(req, res, { name: "contact", max: 5, windowMs: 60 * 60 * 1000 })) return;

  const email = str(req.body?.email, 254);
  const message = str(req.body?.message, 5000);
  const subject = singleLine(req.body?.subject, 150) || "Contact form";
  const phone = singleLine(req.body?.phone, 30);

  if (!isEmail(email) || !message) {
    return res.status(400).json({ message: "Please provide a valid email and a message." });
  }

  try {
    await new Promise((resolve, reject) => {
      // send mail: the sender is always our own account, the visitor's address
      // only goes in replyTo (no spoofed From, no header injection)
      transporter.sendMail(
        {
          replyTo: email,
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: subject,
          text: `Message: ${message}\n\nFrom: ${email}\nPhone: ${phone}`,
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
        "We have received your message and will contact you as soon as possible.",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Your message could not be sent, please try again later." });
  }
});

export default handler;
