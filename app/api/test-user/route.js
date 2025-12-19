// app/api/test-user/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User from "../../models/User";

export async function POST(request) {
  try {
    // 1️⃣ Connect DB
    await connectDB();

    // 2️⃣ Read request body (optional)
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    // 3️⃣ Required fields (fallback for testing)
    const phone = body.phone || "9999999999";
    const role = body.role || "candidate"; // or "recruiter"

    // 4️⃣ Create user
    const newUser = await User.create({
      name: body.name || "Test User",
      email: body.email || `test-${Date.now()}@example.com`,
      phone,
      role,
    });

    // 5️⃣ Success response
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
