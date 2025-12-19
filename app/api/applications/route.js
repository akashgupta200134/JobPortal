import connectDB from "@/lib/mongoose";
import Application from "@/models/Application";
import Job from "@/models/Job"; 
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import fs from "fs";

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

    // Handle File Upload
    const resumeFile = formData.get("resumeFile");
    let resumeUrl = "";
    if (resumeFile && typeof resumeFile !== 'string' && resumeFile.size > 0) {
      const uploadDir = "./public/uploads";
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const fileName = `${Date.now()}-${resumeFile.name}`;
      const filePath = `${uploadDir}/${fileName}`;
      fs.writeFileSync(filePath, Buffer.from(await resumeFile.arrayBuffer()));
      resumeUrl = `/uploads/${fileName}`;
    }

    // Create Application with all fields from your Schema
    const application = await Application.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      candidateId: new mongoose.Types.ObjectId(decoded.userId),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      location: formData.get("location"),
      skills: formData.get("skills"),
      videoProfileUrl: formData.get("videoProfileUrl"),
      resumeUrl: resumeUrl,
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}