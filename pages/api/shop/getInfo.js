import nc from "next-connect";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";
import { fail, str } from "../../../utils/shared/security";

const SECTIONS = ["sliderComponent", "galleryComponent", "categoriesComponent", "discountComponent"];

const handler = nc();

handler.post(async (req, res) => {
  // plain strings only (no query operator objects, no select-string injection)
  const shopName = str(req.body?.shopName, 60);
  const getHomeInfo = req.body?.getHomeInfo === true;
  const excludedSection = SECTIONS.includes(req.body?.excludedSection)
    ? req.body.excludedSection
    : "";
  if (!shopName) return res.status(400).json({ message: "Shop not found!" });

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
        res.status(400).json({ message: "This shop is banned!" });
      } else {
        res.status(200).json(shopInfo);
      }
    } else {
      res.status(400).json({ message: "Shop not found!" });
    }
  } catch (err) {
    fail(res, err);
  }
});

export default handler;
