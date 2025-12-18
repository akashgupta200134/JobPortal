// app/api/applications/route.js
import connectDB from "../../../lib/mongodb";
import Application from "../../models/Application";
import Job from "../../models/Job";
import User from "../../models/User";
import { NextResponse } from "next/server";

// GET all applications (for recruiter)
export async function GET(req) {
  try {
    await connectDB(); // Connect to MongoDB

    // You can filter by recruiterId later from session
    const applications = await Application.find()
      .populate("candidateId", "fullName email phone videoProfile idUpload skillCategory experience")
      .populate("jobId", "title postedBy");

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PATCH to update application status (accept/reject/shortlist)
export async function PATCH(req) {
  try {
    await connectDB(); // Connect to MongoDB
    const body = await req.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Update the application status
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    )
      .populate("candidateId", "fullName email phone videoProfile idUpload skillCategory experience")
      .populate("jobId", "title postedBy");

    return NextResponse.json({ success: true, application: updatedApplication });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
