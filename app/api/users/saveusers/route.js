import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { phone, role } = await req.json();

    if (!phone || !role) {
      return NextResponse.json({ success: false, message: "Phone and role are required" }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/\D/g, "");
    let user = await User.findOne({ phone: normalizedPhone });

    // Role mismatch check
    if (user && user.role !== role) {
      return NextResponse.json(
        { success: false, message: "Role mismatch. Please login with correct role." },
        { status: 403 }
      );
    }

    // Create new user if not exists
    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        role,
      });
    }

    // ✅ FIX: Extract the correct display name
    // If it's a candidate, use fullName. If recruiter, use recruiterName.
    const displayName = user.role === "recruiter" 
      ? (user.recruiterName || "New Recruiter") 
      : (user.fullName || "New User");

    return NextResponse.json(
      { 
        success: true, 
        user: {
          id: user._id.toString(),
          role: user.role,
          phone: user.phone,
          name: displayName, // Send this simplified name field
        },
        isNew: !user.fullName && !user.recruiterName 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Save user error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}