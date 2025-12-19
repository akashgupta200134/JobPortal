import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function PUT(req) {
  try {
    await dbConnect();
    const { userId, fullName } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName: fullName },
      { new: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}