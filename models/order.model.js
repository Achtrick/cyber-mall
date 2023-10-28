import { Schema, model, models } from "mongoose";
import { productSchema } from "./product.model";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    products: [productSchema],
  },
  { timestamps: true }
);
const Order = models.Order || model("Order", orderSchema);

export default Order;
