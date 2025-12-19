// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { phone, role } = await req.json();

    if (!phone || !role) {
      return NextResponse.json(
        { success: false, message: "Phone and role are required" },
        { status: 400 }
      );
    }

    // Normalize phone (recommended)
    const normalizedPhone = phone.replace(/\D/g, "");

    let user = await User.findOne({ phone: normalizedPhone });

    // User exists → role mismatch check
    if (user && user.role !== role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role mismatch. Please login with correct role.",
        },
        { status: 403 }
      );
    }

    // Create new user
    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        role,
      });

      return NextResponse.json(
        { success: true, user, isNew: true },
        { status: 201 }
      );
    }

    // Existing user
    return NextResponse.json(
      { success: true, user, isNew: false },
      { status: 200 }
    );
  } catch (err) {
    console.error("Save user error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
