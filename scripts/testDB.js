// app/api/test-user/route.js
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const newUser = await User.create({
      name: "Test User",
      email: `test-${Math.random()}@example.com`,
      phone: "1234567890", // Added this
      role: "admin"        // Added this
    });

    return Response.json({ 
      message: "🚀 Success! Database is connected and writing data!", 
      user: newUser 
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}