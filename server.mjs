import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";

// ✅ Load environment variables FIRST
dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON before anything else
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:3000"], // Allow multiple origins
  credentials: true,
}));

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("🔴 Error: MONGO_URI is missing in .env!");
  process.exit(1);
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "portfolioDB",  // Make sure this is the correct database name
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout if DB is unreachable
    });

    console.log("🟢 MongoDB Connected Successfully!");

    // ✅ Start server only after DB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("🔴 MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

connectDB();

export default mongoose;
