import connectDB from "@/lib/mongoose";
import Application from "@/models/Application";
import Job from "@/models/Job"; 
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';

// GET: For the Recruiter Table
export async function GET() {
  try {
    await connectDB();
    const applications = await Application.find({})
      .populate("jobId", "title") 
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, applications });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// POST: For the Candidate applying
export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const formData = await req.formData();
    const jobId = formData.get("jobId");

    // Check if already applied
    const alreadyApplied = await Application.findOne({ 
      jobId: new mongoose.Types.ObjectId(jobId), 
      candidateId: decoded.userId 
    });
    
    if (alreadyApplied) return NextResponse.json({ success: false, message: "Already applied" }, { status: 409 });

    // --- CLOUDINARY UPLOAD LOGIC ---
    const resumeFile = formData.get("resumeFile");
    let resumeUrl = "";

    if (resumeFile && typeof resumeFile !== 'string' && resumeFile.size > 0) {
      // 1. Convert File to Buffer
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 2. Upload to Cloudinary using a Promise
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: "auto", // Automatically detects PDF/DOCX
            folder: "resumes"      // Optional: creates a folder in Cloudinary
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      // 3. Get the Secure URL from Cloudinary
      resumeUrl = uploadResponse.secure_url;
    }

    // Create Application with Cloudinary URL
    const application = await Application.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      candidateId: new mongoose.Types.ObjectId(decoded.userId),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      location: formData.get("location"),
      skills: formData.get("skills"),
      videoProfileUrl: formData.get("videoProfileUrl"),
      resumeUrl: resumeUrl, // This is now a https://res.cloudinary.com/... link
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (err) {
    console.error("Cloudinary POST Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}