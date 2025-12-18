import connectDB from "../../../lib/mongodb";
import Job from "../../models/Job";
import User from "../../models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find()
      .populate("postedBy", "companyName recruiterName")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { title, description, skills, location, salaryRange, postedBy } = await req.json();

    if (!title || !description || !postedBy) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Validate recruiter
    const recruiter = await User.findById(postedBy);
    if (!recruiter || recruiter.role !== "recruiter") {
      return NextResponse.json({ success: false, message: "Invalid recruiter" }, { status: 400 });
    }

    const job = await Job.create({
      title,
      description,
      skills: skills ? skills.split(",").map(s => s.trim()) : [],
      location,
      salaryRange,
      postedBy: mongoose.Types.ObjectId(postedBy),
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
