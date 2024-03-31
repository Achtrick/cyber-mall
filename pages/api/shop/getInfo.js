import nc from "next-connect";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";

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
        res.status(200).json(shopInfo);
      }
    } else {
      res.status(400).json({ message: "Shop introuvable !" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
