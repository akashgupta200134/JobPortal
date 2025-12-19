import connectDB from "@/lib/mongoose";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; 

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });

    const application = await Application.findById(id).populate("jobId", "title location salaryRange description");
    if (!application) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, application });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await req.json();

    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, application });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}