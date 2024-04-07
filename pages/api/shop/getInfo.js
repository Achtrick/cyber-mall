import fs from "fs";
import nc from "next-connect";
import path from "path";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";

const createManifest = (shopName, logo, themeColor) => {
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
    start_url: `/shop/?shop=${shopName}`,
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

handler.post(async (req, res) => {
  const { shopName, getHomeInfo = false, excludedSection } = req.body;

  try {
    await connectDB();
    const shopInfo = await Shop.findOne({ name: shopName })
      .select(
        getHomeInfo
          ? excludedSection
            ? `-architecture.home.${excludedSection}`
            : "-architecture.home.sliderComponent -architecture.home.galleryComponent"
          : "-architecture.home"
      )
      .exec();
    if (shopInfo) {
      if (shopInfo.banned) {
        res.status(400).json({ message: "Cette shop est interdite !" });
      } else {
        createManifest(
          shopInfo.name,
          `/api/images/fill/${shopInfo.logo.split("/").pop()}`,
          shopInfo.settings.primaryColor
        );
        res.status(200).json(shopInfo);
      }
    } else {
      res.status(400).json({ message: "Shop introuvable !" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
