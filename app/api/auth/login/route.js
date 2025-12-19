import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { phone, role } = await req.json();

    if (!phone || !role) {
      return NextResponse.json({ success: false, message: "Missing phone or role" }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/\D/g, "");
    let user = await User.findOne({ phone: normalizedPhone });

    if (user && user.role !== role) {
      return NextResponse.json(
        { success: false, message: `Account exists as a ${user.role}. Please login with the correct role.` },
        { status: 403 }
      );
    }

    if (!user) {
      user = await User.create({ phone: normalizedPhone, role });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ FIX: Determine display name based on role and DB data
    let displayName = "New User";
    if (user.role === "recruiter") {
      displayName = user.recruiterName || "Recruiter";
    } else {
      displayName = user.fullName || "User";
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        role: user.role,
        phone: user.phone,
        name: displayName, 
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}