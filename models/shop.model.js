import { Schema, model, models } from "mongoose";

const shopSchema = new Schema(
  {
    name: String,
    settings: {
      headerColor: String,
      footerColor: String,
      primaryColor: String,
      secondaryColor: String,
    },
  },
  { timestamps: true }
);
const Shop = models.Shop || model("Shop", shopSchema);

export default Shop;
