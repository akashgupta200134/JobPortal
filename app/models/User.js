// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Role: candidate or recruiter
  role: { 
    type: String, 
    enum: ["candidate", "recruiter"], 
    required: true 
  },

  // Common login fields
  phone: { type: String, required: true, unique: true },


  // Candidate-specific fields
  fullName: { type: String },
  email: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  skillCategory: { type: String, enum: ["softwareDevelopment", "design", "marketing", "sales"] },
  experience: { type: String, enum: ["0-2", "2-5", "5+"] },
  expectedSalary: { type: Number },
  videoProfile: { type: String }, // URL or path to uploaded video
  idUpload: { type: String },     // URL or path to uploaded ID

  // Recruiter-specific fields
  companyName: { type: String },
  companyEmail: { type: String },
  recruiterName: { type: String },
}, { timestamps: true });

// Prevent model overwrite in dev mode
export default mongoose.models.User || mongoose.model("User", UserSchema);


