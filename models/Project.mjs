import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Project", ProjectSchema);