import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  theme: { type: String, default: "default" },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model("Portfolio", PortfolioSchema);