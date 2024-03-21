import nc from "next-connect";
import connectDB from "../../../utils/connectDB";
import User from "../../../models/user.model";
import Shop from "../../../models/shop.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../../../utils/shared/mailer";
import { mailcss } from "../../../utils/shared/mailer";
import crypto from "crypto";

const token = crypto.randomBytes(10).toString("hex");

const handler = nc();

handler.post(async (req, res) => {
  var salt = bcrypt.genSaltSync(10);
  await connectDB();
  const url = `https://cyber-mall.tn/api/auth/activate/${token}`;
  const data = req.body;

  try {
    const userExists = await User.findOne({ email: data.email.toLowerCase() });
    if (userExists) {
      return res
        .status(403)
        .json({ message: "il y a un utilisateur avec cette addresse email !" });
    }

    const shopExists = await Shop.findOne({
      name: data.shopName.toLowerCase(),
    });

    if (shopExists) {
      return res.status(403).json({ message: "il y a un shop avec ce nom !" });
    }

    const shop = await Shop.create({
      name: data.shopName.toLowerCase(),
      settings: {
        headerColor: "black",
        footerColor: "black",
        primaryColor: "#bb84e8",
        secondaryColor: "#ec008c",
      },
      architecture: {
        home: {
          sliderComponent: [],
          categoriesComponent: {
            visibleIndex: 0,
            selectedCategoriesIds: [],
          },
          discountComponent: {
            visibleIndex: 0,
          },
          galleryComponent: {
            visibleIndex: 0,
            content: [],
          },
        },
        contact: {
          address: "",
          socials: {
            instagram: "",
            tiktok: "",
            facebook: "",
            youtube: "",
            linkedIn: "",
          },

          direct: { email: "", phone: "" },
        },
        about: "",
      },
    });

    const user = await User.create({
      ...data,
      role: "ADMIN",
      email: data.email.toLowerCase(),
      password: bcrypt.hashSync(data.password, salt),
      shop: shop._id,
      token: token,
    });

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: user.email,
          replyTo: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: "Vérification de votre email",
          text: "Suivez ce lien pour activer votre shop.",
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
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Suivez ce lien pour activer votre shop:</h1>
              <div` +
            mailcss.body +
            `>
              <h3 style="font-size: 10px; font-wheight:300;">${url}</h3>
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

    res.status(200).json("success");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
