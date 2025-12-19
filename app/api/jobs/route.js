import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

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

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

    const recruiter = await User.findById(decoded.userId);
    if (!recruiter) {
      return NextResponse.json(
        { success: false, message: "Recruiter not found" },
        { status: 404 }
      );
    }

    const job = await Job.create({
      title,
      description,
      skills: skills ? skills.split(",").map((s) => s.trim()) : [],
      location,
      salaryRange,
      postedBy: new mongoose.Types.ObjectId(decoded.userId),
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    console.error("POST job error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json(
        { success: false, message: "Only recruiters can update jobs" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    if (job.postedBy.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "You can only update your own jobs" },
        { status: 403 }
      );
    }

    const { title, description, skills, location, salaryRange } =
      await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    job.title = title;
    job.description = description;
    job.skills = skills ? skills.split(",").map((s) => s.trim()) : [];
    job.location = location;
    job.salaryRange = salaryRange;

    await job.save();

    return NextResponse.json(
      { success: true, message: "Job updated successfully", job },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT job error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json(
        { success: false, message: "Only recruiters can delete jobs" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    if (job.postedBy.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own jobs" },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(jobId);

    return NextResponse.json(
      { success: true, message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE job error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
