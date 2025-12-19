import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const phone = body.phone || "9999999999";
    const role = body.role || "candidate";

    const newUser = await User.create({
      name: body.name || "Test User",
      email: body.email || `test-${Date.now()}@example.com`,
      phone,
      role,
    });

    return NextResponse.json(
      {
        message: "🚀 Data saved successfully!",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
