import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    designation: String,
    slug: String,
    images: [String],
    price: { type: Number, default: 0 },
    variants: { type: [String], default: [] },
    discount: { type: Number, default: 0 },
    description: String,
    qty: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "ProductCategory" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);
const Product = models.Product || model("Product", productSchema);

export default Product;
export { productSchema };
