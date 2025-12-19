import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["candidate", "recruiter"], required: true },
    phone: { type: String, required: true, unique: true }, // Unique index
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

// Pre-save hook to normalize phone number
UserSchema.pre("save", async function () {
  if (this.isModified("phone")) {
    this.phone = this.phone.replace(/\D/g, "");
  }
  // Mongoose knows to move to the next step when the async function resolves
});

export default mongoose.models.User || mongoose.model("User", UserSchema);