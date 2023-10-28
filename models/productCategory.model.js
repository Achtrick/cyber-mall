import { Schema, model, models } from "mongoose";

const productCategorySchema = new Schema(
  {
    name: String,
    icon: { type: String, default: "" },
    accentColor: { type: String, default: "" },
  },
  { timestamps: true }
);
const ProductCategory =
  models.ProductCategory || model("ProductCategory", productCategorySchema);

export default ProductCategory;
