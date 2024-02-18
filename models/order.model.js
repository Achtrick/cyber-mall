import { Schema, model, models } from "mongoose";
import { productSchema } from "./product.model";

const orderSchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    user: {
      type: Object,
      default: {
        firstName: "",
        lastName: "",
        address: "",
        postalCode: "",
        city: "",
        phone: "",
      },
    },
    state: { type: String, default: "WAITING" }, // WAITING CLOSED
    products: [productSchema],
  },
  { timestamps: true }
);
const Order = models.Order || model("Order", orderSchema);

export default Order;
