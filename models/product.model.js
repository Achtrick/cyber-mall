import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    designation: String,
    images: [String],
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
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
