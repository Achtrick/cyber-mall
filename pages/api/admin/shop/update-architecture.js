import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { removeFile } from "../../../../utils/shared/removeFile";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const { shopId, component, body } = req.body;

  try {
    const shop = await Shop.findOne({ _id: shopId });
    switch (component) {
      case "sliderComponent":
        let slidesToDelete = shop.architecture.home.sliderComponent.filter(
          (item1) => !body.some((item2) => item1.image === item2.image)
        );

        for (let slide of slidesToDelete) {
          removeFile(slide.image.split("/").pop());
        }

        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, sliderComponent: body },
        };
        break;
      case "categoriesComponent":
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, categoriesComponent: body },
        };
        break;
      case "discountComponent":
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, discountComponent: body },
        };
        break;
      case "galleryComponent":
        let itemsToDelete =
          shop.architecture.home.galleryComponent.content.filter(
            (item1) =>
              !body.content.some((item2) => item1.image === item2.image)
          );

        for (let item of itemsToDelete) {
          removeFile(item.image.split("/").pop());
        }
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, galleryComponent: body },
        };
        break;
      case "shippingFee":
        shop.shippingFee = body.shippingFee;
        shop.freeShipping = body.freeShipping;
        break;
      case "contactComponent":
        shop.architecture = {
          ...shop.architecture,
          contact: body,
        };
        break;
      case "aboutComponent":
        shop.architecture = {
          ...shop.architecture,
          about: body,
        };
        break;
      default:
        break;
    }
    await shop.save();

    res.status(200).json({ message: "Données enregistrer", shopInfo: shop });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
