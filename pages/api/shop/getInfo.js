import nc from "next-connect";
import connectDB from "../../../utils/connectDB";
import Shop from "../../../models/shop.model";

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
    shopInfo
      ? res.status(200).json(shopInfo)
      : res.status(400).json({ message: "shop not found !" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
