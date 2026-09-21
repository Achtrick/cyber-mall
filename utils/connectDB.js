import mongoose from "mongoose";

mongoose.set("strictQuery", true);
const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  return mongoose.connect(process.env.DB_URI);
};

export default connectMongo;
