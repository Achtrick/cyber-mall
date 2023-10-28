import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    designation: String,
    image: String,
    price: String,
    description: String,
    qty: String,
    category: { type: Schema.Types.ObjectId, ref: "ProductCategory" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);
const Product = models.Product || model("Product", productSchema);

export default Product;
export { productSchema };
