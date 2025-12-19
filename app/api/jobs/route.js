import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

/* ================= GET JOBS ================= */
export async function GET() {
  try {
    await connectDB();

    const jobs = await Job.find()
      .populate("postedBy", "companyName recruiterName")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error("GET jobs error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ================= CREATE JOB ================= */
export async function POST(req) {
  try {
    await connectDB();

    // 🔐 Read JWT from cookie
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Role check
    if (decoded.role !== "recruiter") {
      return NextResponse.json(
        { success: false, message: "Only recruiters can post jobs" },
        { status: 403 }
      );
    }

    const { title, description, skills, location, salaryRange } =
      await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure recruiter exists
    const recruiter = await User.findById(decoded.userId);
    if (!recruiter) {
      return NextResponse.json(
        { success: false, message: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      skills: skills
        ? skills.split(",").map((s) => s.trim())
        : [],
      location,
      salaryRange,
      postedBy: new mongoose.Types.ObjectId(decoded.userId),
    });

    return NextResponse.json(
      { success: true, job },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST job error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
