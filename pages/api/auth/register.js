import bcrypt from "bcryptjs";
import nc from "next-connect";
import Shop from "../../../models/shop.model";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { ActivityDomains } from "../../../utils/shared/activityDomains";
import { mailcss, transporter } from "../../../utils/shared/mailer";
import {
  SHOP_NAME_RESERVED,
  fail,
  getSiteUrl,
  isEmail,
  isPassword,
  newToken,
  rateLimit,
  str,
} from "../../../utils/shared/security";

const handler = nc();

handler.post(async (req, res) => {
  if (!rateLimit(req, res, { name: "register", max: 10, windowMs: 60 * 60 * 1000 })) return;

  // never spread req.body into the model (mass assignment): pick and validate
  const body = req.body || {};
  const email = str(body.email, 254).toLowerCase();
  const shopName = str(body.shopName, 40).toLowerCase();
  const activityDomain = str(body.activityDomain, 100);
  const invalid = (message) => res.status(400).json({ message });

  if (!isEmail(email)) return invalid("Invalid email address!");
  if (!isPassword(body.password)) {
    return invalid("Password must be between 8 and 72 characters!");
  }
  if (!/^[a-z0-9_-]{1,40}$/.test(shopName) || SHOP_NAME_RESERVED.has(shopName)) {
    return invalid("Invalid shop name!");
  }
  if (!ActivityDomains.some((d) => d.name === activityDomain)) {
    return invalid("Invalid activity domain!");
  }

  // one unique, unguessable activation token per registration; only its hash is stored
  const token = newToken();
  const siteUrl = getSiteUrl(req);
  const url = `${siteUrl}/api/auth/activate/${token.raw}`;

  try {
    await connectDB();
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(403)
        .json({ message: "A user with this email address already exists!" });
    }

    const shopExists = await Shop.findOne({ name: shopName });

    if (shopExists) {
      return res.status(403).json({ message: "A shop with this name already exists!" });
    }

    const shop = await Shop.create({
      name: shopName,
      domainName: "",
      activityDomain: activityDomain,
      pack: { type: "FREE", expiresIn: "" },
      settings: {
        headerColor: "#ffffff",
        footerColor: "#000000",
        primaryColor: "#000000",
        secondaryColor: "#000000",
      },
      architecture: {
        home: {
          sliderComponent: [],
          categoriesComponent: {
            visibleIndex: 0,
            visible: true,
            selectedCategoriesIds: [],
          },
          discountComponent: {
            visibleIndex: 0,
            visible: true,
          },
          galleryComponent: {
            visibleIndex: 0,
            visible: true,
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

    let user;
    try {
      user = await User.create({
        firstName: str(body.firstName, 60),
        lastName: str(body.lastName, 60),
        phone: str(body.phone, 30),
        address: str(body.address, 300),
        role: "ADMIN",
        email,
        password: await bcrypt.hash(body.password, 10),
        shop: shop._id,
        token: token.hash,
      });
    } catch (err) {
      await Shop.findByIdAndDelete(shop._id); // do not leave an orphan shop behind
      throw err;
    }

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: user.email,
          replyTo: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: "Verify your email",
          text: "Follow this link to activate your shop.",
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
            <img style="object-fit: contain;" alt="Cyber-Mall" title="Cyber-Mall" src="${siteUrl}/images/logo.png" width="70%" height="80px">
            </div>
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Follow this link to activate your shop:</h1>
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
    }).catch(async (err) => {
      // the activation mail could not be sent: do not leave an account nobody can activate
      await User.findByIdAndDelete(user._id);
      await Shop.findByIdAndDelete(shop._id);
      throw err;
    });

    res.status(200).json("success");
  } catch (err) {
    return fail(res, err, 400, "Registration failed, please try again.");
  }
});

export default handler;
