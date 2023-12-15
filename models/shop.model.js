import { Schema, model, models } from "mongoose";

const shopSchema = new Schema(
  {
    name: { type: String, unique: true },
    logo: { type: String, default: "" },
    settings: {
      headerColor: { type: String, default: "black" },
      footerColor: { type: String, default: "black" },
      primaryColor: { type: String, default: "#bb84e8" },
      secondaryColor: { type: String, default: "#ec008c" },
    },
  },
  { timestamps: true }
);
const Shop = models.Shop || model("Shop", shopSchema);

export default Shop;
