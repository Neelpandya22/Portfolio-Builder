import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("🔴 Error: MONGO_URI is missing in .env file!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    dbName: "portfolioDB", // Make sure this matches the DB name
    serverSelectionTimeoutMS: 5000, // Prevents long wait times if MongoDB is unreachable
  })
  .then(() => console.log("🟢 MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("🔴 MongoDB Connection Error:", err.message);
    process.exit(1);
  });

export default mongoose;