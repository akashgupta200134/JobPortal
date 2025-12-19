import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const { phone, role } = await req.json();
    const normalizedPhone = phone.replace(/\D/g, "");

    let user = await User.findOne({ phone: normalizedPhone });

    // 🚫 Role mismatch protection
    if (user && user.role !== role) {
      return NextResponse.json(
        { success: false, message: "Role mismatch. Login with correct role." },
        { status: 403 }
      );
    }

    // Create user if new
    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        role,
      });
    }

    // 🔐 Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 SET COOKIE (THIS WAS MISSING)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        role: user.role,
        phone: user.phone,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
