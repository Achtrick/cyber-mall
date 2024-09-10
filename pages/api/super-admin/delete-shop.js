import mongoose from "mongoose";
import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import DomainDemand from "../../../models/domainDemand.model";
import Order from "../../../models/order.model";
import ProductCategory from "../../../models/productCategory.model";
import Shop from "../../../models/shop.model";
import UpgradeDemand from "../../../models/upgradeDemand.model";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { removeFile } from "../../../utils/shared/removeFile";
import { deleteCategory } from "../admin/categories/delete";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { shopId } = req.body;
  try {
    await connectDB();

    const shop = await Shop.findById(shopId);
    removeFile(shop.logo.split("/").pop());
    shop.architecture.home.sliderComponent.map((slide) => {
      removeFile(slide.image.split("/").pop());
    });
    shop.architecture.home.galleryComponent.content.map((slide) => {
      removeFile(slide.image.split("/").pop());
    });
    await User.findOneAndDelete({ shop: mongoose.Types.ObjectId(shopId) });
    await UpgradeDemand.findOneAndDelete({
      shop: mongoose.Types.ObjectId(shopId),
    });
    await DomainDemand.findOneAndDelete({
      shop: mongoose.Types.ObjectId(shopId),
    });
    await Order.deleteMany({ shop: mongoose.Types.ObjectId(shopId) });

    const categories = await ProductCategory.find({
      shop: mongoose.Types.ObjectId(shopId),
    });

    for (const category of categories) {
      await deleteCategory(category._id);
    }

    await Shop.findByIdAndDelete(shopId);
    res.status(200).json({
      message: `deleted shop: ${shop.name}`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
