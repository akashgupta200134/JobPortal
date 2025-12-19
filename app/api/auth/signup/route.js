import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Received signup data:", body);
    const { role, phone, email } = body;

    if (!phone || !role) {
      console.log("Missing required fields - phone:", phone, "role:", role);
      return NextResponse.json(
        {
          success: false,
          message: "Phone and role are required",
          receivedData: body,
        },
        { status: 400 }
      );
    }

    const normalizedPhone = phone.replace(/\D/g, "");

    const existingUser = await User.findOne({
      $or: [{ phone: normalizedPhone }, { email: email }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this phone or email",
        },
        { status: 409 }
      );
    }

    let userData = {
      phone: normalizedPhone,
      role,
    };

    if (role === "candidate") {
      userData = {
        ...userData,
        fullName: body.fullName,
        email: body.email,
        dob: body.dob,
        gender: body.gender,
        skillCategory: body.skillCategory,
        experience: body.experience,
        expectedSalary: body.expectedSalary,
        videoProfile: body.videoProfile,
        idUpload: body.idUpload,
      };
    } else if (role === "recruiter") {
      userData = {
        ...userData,
        companyName: body.companyName,
        companyEmail: body.companyEmail || body.email,
        recruiterName: body.recruiterName,
      };
    }

    const user = await User.create(userData);

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
      message: "Account created successfully",
      user: {
        _id: user._id.toString(),
        id: user._id.toString(),
        role: user.role,
        phone: user.phone,
        email: user.email || user.companyEmail,
        fullName: user.role === "candidate" ? user.fullName : user.recruiterName,
        email: user.email || user.companyEmail,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
