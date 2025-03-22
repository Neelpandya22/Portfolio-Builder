import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.mjs"; // ✅ Ensure file uses ES module export

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Define API routes
app.use("/api/auth", authRoutes);

// ✅ Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`🟢 MongoDB Connected`);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("🔴 MongoDB Connection Error:", err));

  export default app;