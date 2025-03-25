import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.mjs"; // Ensure the route exists

// ✅ Load environment variables early
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());

// ✅ CORS Configuration
app.use(cors({
  origin: "http://localhost:8080", // Allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("🔴 Error: MONGO_URI is not defined in .env file!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {  serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("🟢 MongoDB Connected");

    // Start server after DB connection is established
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("🔴 MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Register API Routes
app.use("/api/auth", authRoutes); // Mount auth routes properly

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("API is running... 🚀");
});

// ✅ Graceful Shutdown for MongoDB
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  console.log("🔴 MongoDB Disconnected");
  process.exit(0);
});

// ✅ Handle Errors
process.on("uncaughtException", (err) => {
  console.error("🛑 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Promise Rejection:", err);
  process.exit(1);
});

export default app;
