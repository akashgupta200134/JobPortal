import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { phone, role } = await req.json();
    const normalizedPhone = phone.replace(/\D/g, "");

    let user = await User.findOne({ phone: normalizedPhone });

    if (user && user.role !== role) {
      return NextResponse.json(
        { success: false, message: "Role mismatch. Login with correct role." },
        { status: 403 }
      );
    }

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        role,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        id: user._id.toString(),
        role: user.role,
        phone: user.phone,
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
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
