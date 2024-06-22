import { Schema, model, models } from "mongoose";

const DomainDemandSchema = new Schema(
  {
    userName: String,
    phone: String,
    email: String,
    domainName: String,
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);
const DomainDemand =
  models.DomainDemand || model("DomainDemand", DomainDemandSchema);

export default DomainDemand;
