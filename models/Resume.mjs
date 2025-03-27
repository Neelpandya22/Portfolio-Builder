import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  skills: [String],
  experience: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", ResumeSchema);