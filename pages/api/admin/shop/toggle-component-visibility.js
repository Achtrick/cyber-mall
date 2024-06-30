import mongoose from "mongoose";
import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const { shopId, componentName } = req.body;
  const shop = await Shop.findById(mongoose.Types.ObjectId(shopId));
  try {
    switch (componentName) {
      case "categoriesComponent":
        shop.architecture = {
          ...shop.architecture,
          home: {
            ...shop.architecture.home,
            categoriesComponent: {
              ...shop.architecture.home.categoriesComponent,
              visible: !shop.architecture.home.categoriesComponent.visible,
            },
          },
        };
        break;
      case "discountComponent":
        shop.architecture = {
          ...shop.architecture,
          home: {
            ...shop.architecture.home,
            discountComponent: {
              ...shop.architecture.home.discountComponent,
              visible: !shop.architecture.home.discountComponent.visible,
            },
          },
        };
        break;
      case "galleryComponent":
        shop.architecture = {
          ...shop.architecture,
          home: {
            ...shop.architecture.home,
            galleryComponent: {
              ...shop.architecture.home.galleryComponent,
              visible: !shop.architecture.home.galleryComponent.visible,
            },
          },
        };
        break;
      default:
        break;
    }
    await shop.save();

    res.status(200).json({ message: "Données enregistrer", shopInfo: shop });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
