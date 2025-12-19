import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ["candidate", "recruiter"], required: true },

  phone: { type: String, required: true, unique: true },

  // Candidate fields
  fullName: { type: String, required: function() { return this.role === "candidate"; } },
  email: { type: String, unique: true, sparse: true },
  dob: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  skillCategory: { type: String, enum: ["softwareDevelopment", "design", "marketing", "sales"] },
  experience: { type: String, enum: ["0-2", "2-5", "5+"] },
  expectedSalary: { type: Number },
  videoProfile: { type: String },
  idUpload: { type: String },

  // Recruiter fields
  companyName: { type: String, required: function() { return this.role === "recruiter"; } },
  companyEmail: { type: String, unique: true, sparse: true },
  recruiterName: { type: String },

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
