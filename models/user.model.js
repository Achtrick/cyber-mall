import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    adress: String,
    phone: String,
    email: { type: String, unique: true },
    password: String,
    role: String, // SUPER-ADMIN / ADMIN
    token: String,
    shop: { type: Schema.Types.ObjectId, ref: "Shop" }, // REFERENCE FOR THE ADMIN SHOP
  },
  { timestamps: true }
);
const User = models.User || model("User", userSchema);

export default User;
