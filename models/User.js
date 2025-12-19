import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["candidate", "recruiter"], required: true },
    phone: { type: String, required: true, unique: true },
    fullName: { type: String },
    email: { type: String, unique: true, sparse: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    skillCategory: { type: String, enum: ["softwareDevelopment", "design", "marketing", "sales"] },
    experience: { type: String, enum: ["0-2", "2-5", "5+"] },
    expectedSalary: { type: Number },
    videoProfile: { type: String },
    idUpload: { type: String },
    companyName: { type: String },
    companyEmail: { type: String, unique: true, sparse: true },
    recruiterName: { type: String },
  },
  { timestamps: true }
);

// FIX: Switched to async function to avoid 'next is not a function' error
UserSchema.pre("save", async function () {
  if (this.isModified("phone")) {
    this.phone = this.phone.replace(/\D/g, "");
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);