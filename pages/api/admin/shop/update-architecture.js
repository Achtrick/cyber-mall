import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { cleanComponent } from "../../../../utils/shared/architectureInput";
import { fail, str } from "../../../../utils/shared/security";
import { removeFile } from "../../../../utils/shared/storage";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { shopId: bodyShopId, body } = req.body || {};
  const component = str(req.body?.component, 40);
  // always the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, bodyShopId);
  if (!shopId) return;

  try {
    await connectDB();
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // validated + rebuilt from whitelisted fields (also strips javascript: links)
    const clean = await cleanComponent(component, body, shop);
    if (clean === null) {
      return res.status(400).json({ message: "Invalid data" });
    }

    switch (component) {
      case "sliderComponent":
        let slidesToDelete = shop.architecture.home.sliderComponent.filter(
          (item1) => !clean.some((item2) => item1.image === item2.image)
        );

        for (let slide of slidesToDelete) {
          await removeFile(slide.image.split("/").pop());
        }

        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, sliderComponent: clean },
        };
        break;
      case "categoriesComponent":
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, categoriesComponent: clean },
        };
        break;
      case "discountComponent":
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, discountComponent: clean },
        };
        break;
      case "galleryComponent":
        let itemsToDelete =
          shop.architecture.home.galleryComponent.content.filter(
            (item1) =>
              !clean.content.some((item2) => item1.image === item2.image)
          );

        for (let item of itemsToDelete) {
          await removeFile(item.image.split("/").pop());
        }
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, galleryComponent: clean },
        };
        break;
      case "shippingFee":
        shop.shippingFee = clean.shippingFee;
        shop.freeShipping = clean.freeShipping;
        break;
      case "contactComponent":
        shop.architecture = {
          ...shop.architecture,
          contact: clean,
        };
        break;
      case "aboutComponent":
        shop.architecture = {
          ...shop.architecture,
          about: clean,
        };
        break;
      default:
        break;
    }
    await shop.save();

    res.status(200).json({ message: "Data saved", shopInfo: shop });
  } catch (err) {
    fail(res, err, 400, "Could not save the changes");
  }
});

export default handler;
