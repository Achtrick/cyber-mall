import fs from "fs";
import nc from "next-connect";
import path from "path";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { removeFile } from "../../../../utils/shared/removeFile";

export const updateManifestJsonFile = (
  shopName,
  domainName,
  logo,
  themeColor
) => {
  const shopNameCap = shopName.charAt(0).toUpperCase() + shopName.slice(1);

  const manifestData = {
    short_name: shopNameCap,
    name: shopNameCap,
    icons: [
      {
        src: logo,
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: logo,
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: logo,
        type: "image/png",
        sizes: "512x512",
      },
    ],
    start_url: domainName.length ? "/" : `/${shopName}`,
    theme_color: themeColor,
    background_color: "#808080",
    display: "standalone",
    scope: "/",
  };

  const manifestFilePath = path.join(
    process.cwd(),
    "public/manifests",
    `${shopName}.webmanifest`
  );
  const manifestContent = JSON.stringify(manifestData, null, 2);

  fs.writeFileSync(manifestFilePath, manifestContent);
};

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const { shopId, logo } = req.body;

  try {
    const shop = await Shop.findOne({ _id: shopId });

    removeFile(shop.logo.split("/").pop());

    shop.logo = logo;

    await shop.save();

    updateManifestJsonFile(
      shop.name,
      shop.domainName,
      `/api/images/fill/${shop.logo.split("/").pop()}`,
      shop.settings.primaryColor
    );

    res.status(200).json({ message: "Logo Modifié" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
