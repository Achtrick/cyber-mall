import mongoose from "mongoose";
import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import ProductCategory from "../../../../models/productCategory.model";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const data = req.body;
  const shop = await Shop.findById(mongoose.Types.ObjectId(data.shop));
  try {
    const productCategory = await ProductCategory.create(data);
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
    res.status(200).json({ message: "Catégorie Ajoutée" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};
