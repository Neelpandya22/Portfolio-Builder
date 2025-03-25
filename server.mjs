import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.mjs"; // ✅ Ensure ES module compatibility

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Define API routes
app.use("/api/auth", authRoutes);

// ✅ Check if MongoDB URI is set
if (!process.env.MONGO_URI) {
  console.error("🔴 Error: MONGO_URI is not defined in .env file!");
  process.exit(1);
}

// ✅ Connect to MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
   
  })
  .then(() => {
    console.log("🟢 MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("🔴 MongoDB Connection Error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// ✅ Handle unexpected errors
process.on("uncaughtException", (err) => {
  console.error("🛑 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Promise Rejection:", err);
  process.exit(1);
});

export default app;
