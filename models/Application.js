import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Fields captured from the Application Form
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  location: { type: String },
  skills: { type: String },
  
  // File Uploads
  videoProfileUrl: { type: String, required: true },
  resumeUrl: { type: String }, 
  
  status: { 
    type: String, 
    enum: ["applied", "shortlisted", "rejected", "accepted"], 
    default: "applied" 
  },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);