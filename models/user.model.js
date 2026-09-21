import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    address: String,
    phone: String,
    email: { type: String, unique: true },
    password: String,
    role: String, // SUPER-ADMIN / ADMIN
    token: String, // sha256 of the activation token (legacy: raw 20 char token)
    resetToken: String, // sha256 of the password reset token
    resetTokenExpires: Date,
    passwordChangedAt: Date, // JWTs issued before this are rejected
    shop: { type: Schema.Types.Mixed }, // REFERENCE FOR THE ADMIN SHOP
  },
  { timestamps: true }
);
const User = models.User || model("User", userSchema);

export default User;
