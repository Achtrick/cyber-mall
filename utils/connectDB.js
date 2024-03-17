import mongoose from "mongoose";

mongoose.set("strictQuery", true);
const connectMongo = async () => mongoose.connect(process.env.DB_URI);

export default connectMongo;
