import mongoose from "mongoose";

const connectMongo = async () => mongoose.connect(process.env.DB_URI);

export default connectMongo;
