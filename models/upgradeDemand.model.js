import { Schema, model, models } from "mongoose";

const UpgradeDemandSchema = new Schema(
  {
    userName: String,
    phone: String,
    email: String,
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    period: String,
  },
  { timestamps: true }
);
const UpgradeDemand =
  models.UpgradeDemand || model("UpgradeDemand", UpgradeDemandSchema);

export default UpgradeDemand;
