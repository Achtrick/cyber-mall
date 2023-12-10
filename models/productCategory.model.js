import { Schema, model, models } from "mongoose";

const productCategorySchema = new Schema(
  {
    name: String,
    description: String,
    icon: { type: String, default: "" },
    accentColor: { type: String, default: "" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);
const ProductCategory =
  models.ProductCategory || model("ProductCategory", productCategorySchema);

export default ProductCategory;
