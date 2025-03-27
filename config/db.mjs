import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("🔴 MONGO_URI is not defined in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// ✅ Use ES module export
export { connectDB };
