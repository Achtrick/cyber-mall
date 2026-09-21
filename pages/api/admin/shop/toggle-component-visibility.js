import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { fail, str } from "../../../../utils/shared/security";

const handler = nc();

handler.post(auth, async (req, res) => {
  // always the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, req.body?.shopId);
  if (!shopId) return;
  const componentName = str(req.body?.componentName, 40);
  try {
    await connectDB();
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
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

    res.status(200).json({ message: "Data saved", shopInfo: shop });
  } catch (err) {
    fail(res, err, 400, "Could not save the changes");
  }
});

export default handler;
