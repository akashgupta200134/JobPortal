import connectDB from "@/lib/mongoose";
import Application from "@/models/Application";
import Job from "@/models/Job";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
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

    let applications;

    if (decoded.role === "candidate") {
      applications = await Application.find({ candidateId: decoded.userId })
        .populate("jobId", "title description location salaryRange postedBy")
        .populate({
          path: "jobId",
          populate: { path: "postedBy", select: "companyName recruiterName" },
        })
        .sort({ createdAt: -1 });
    } else if (decoded.role === "recruiter") {
      const recruiterJobs = await Job.find({ postedBy: decoded.userId }).select(
        "_id"
      );
      const jobIds = recruiterJobs.map((job) => job._id);

      applications = await Application.find({ jobId: { $in: jobIds } })
        .populate("jobId", "title description location salaryRange")
        .populate("candidateId", "name email phone")
        .sort({ createdAt: -1 });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("GET applications error:", error);
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

    if (decoded.role !== "candidate") {
      return NextResponse.json(
        { success: false, message: "Only candidates can apply" },
        { status: 403 }
      );
    }

    const { jobId, videoProfileUrl, idCardUrl } = await req.json();

    if (!jobId || !videoProfileUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
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

    const alreadyApplied = await Application.findOne({
      jobId,
      candidateId: decoded.userId,
    });

    if (alreadyApplied) {
      return NextResponse.json(
        { success: false, message: "Already applied" },
        { status: 409 }
      );
    }

    const application = await Application.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      candidateId: new mongoose.Types.ObjectId(decoded.userId),
      videoProfileUrl,
      idCardUrl,
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error("Apply job error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
