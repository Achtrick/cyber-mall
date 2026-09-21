import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import ProductCategory from "../../../../models/productCategory.model";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { cleanColor, cleanImage, fail, str } from "../../../../utils/shared/security";

const handler = nc();

handler.post(auth, async (req, res) => {
  const data = req.body || {};
  // the shop is the caller's own shop; a foreign shop id in the body is rejected
  const shopId = resolveShop(req, res, data.shop);
  if (!shopId) return;

  const name = str(data.name, 100);
  if (!name) return res.status(400).json({ message: "Category name is required" });
  const icon = data.icon ? cleanImage(data.icon, shopId) : "";
  if (icon === null) return res.status(400).json({ message: "Invalid image" });

  try {
    await connectDB();
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // whitelist fields (no mass assignment)
    const productCategory = await ProductCategory.create({
      name,
      description: str(data.description, 1000),
      icon,
      accentColor: cleanColor(data.accentColor),
      shop: shop._id,
    });
    shop.architecture = {
      ...shop.architecture,
      home: {
        ...shop.architecture.home,
        categoriesComponent: {
          ...shop.architecture.home.categoriesComponent,
          selectedCategoriesIds: [
            ...shop.architecture.home.categoriesComponent.selectedCategoriesIds,
            productCategory._id,
          ],
        },
      },
    };
    await shop.save();
    res.status(200).json({ message: "Category added" });
  } catch (err) {
    fail(res, err, 400, "Could not add the category");
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
