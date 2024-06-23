import fs from "fs";
import mongoose from "mongoose";
import nc from "next-connect";
import path from "path";
import auth from "../../../middlewares/super-admin-auth";
import Shop from "../../../models/shop.model";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { mailcss, transporter } from "../../../utils/shared/mailer";
import { updateManifestJsonFile } from "../admin/shop/update-logo";

const updateDomainsJsonFile = (shopName, domainName) => {
  const domainsFilePath = path.join(
    process.cwd(),
    "public/domainNames/domainNames.json"
  );

  const domainsFileContent = JSON.parse(
    fs.readFileSync(domainsFilePath, "utf8")
  );
  const foundOneAndEdited = domainsFileContent.map((_) => {
    if (_.shop === shopName) {
      _.domain = domainName;
      return true;
    }
  });
  if (!foundOneAndEdited) {
    domainsFileContent.push({ shop: shopName, domain: domainName });
  }

  fs.writeFileSync(
    domainsFilePath,
    JSON.stringify(domainsFileContent, null, 2)
  );
};

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const { shopId, domainName } = req.body;

  try {
    const shop = await Shop.findOne({ _id: shopId });
    const user = await User.findOne({
      shop: mongoose.Types.ObjectId(shopId),
    });
    shop.domainName = domainName;
    updateDomainsJsonFile(shop.name, domainName);
    updateManifestJsonFile(
      shop.name,
      domainName,
      `/api/images/fill/${shop.logo.split("/").pop()}`,
      shop.settings.primaryColor
    );
    await shop.save();
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(
        {
          from: process.env.AUTH_SUPERADMIN_EMAIL,
          to: user.email,
          replyTo: process.env.AUTH_SUPERADMIN_EMAIL,
          subject: "Intégration de nom de domaine",
          text: "Intégration de nom de domaine est effectuée avec success.",
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
            <h1 style="text-transform: capitalize; font-size: 15px; font-wheight:500;" width="100%" text-align="center">Intégration de nom de domaine est effectuée avec success.</h1>
              <div` +
            mailcss.body +
            `>
              <h3 style="font-size: 10px; font-wheight:300;">félicitation, l'ntégration de votre nom de domaine est effectuée avec success.</h3>
              <hr/>
              <h3 style="font-size: 10px; font-wheight:300;">Vous pouvez maintenant accéder à votre site sous l'url: ${domainName}</h3>
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
      message: "Nom de domaine modifié.",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
