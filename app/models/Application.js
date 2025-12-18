// models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  videoProfileUrl: { type: String, required: true },
  idCardUrl: { type: String },
  status: { type: String, enum: ["applied", "shortlisted", "rejected", "accepted"], default: "applied" },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
