import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],
  githubLink: { type: String },
  liveLink: { type: String },
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
