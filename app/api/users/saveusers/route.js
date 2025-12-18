import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { phone, role } = await req.json();

    if (!phone || !role) {
      return new Response(
        JSON.stringify({ success: false, message: "Phone & role required" }),
        { status: 400 }
      );
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, role });
    }

    return new Response(
      JSON.stringify({ success: true, user }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Save user error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}

