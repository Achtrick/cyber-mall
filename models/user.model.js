import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    birthDate: String,
    adress: String,
    phone: String,
    email: String,
    password: String,
    role: String, // SUPER-ADMIN / ADMIN / CLIENT
  },
  { timestamps: true }
);
const User = models.User || model("User", userSchema);

export default User;
