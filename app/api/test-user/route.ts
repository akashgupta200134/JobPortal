// app/api/test-user/route.js
import connectDB from "../../../lib/mongodb";
import User from "../../models/User";

export async function POST(request) {
  try {
    await connectDB(); // Use your corrected connection logic

    // Create a dummy user
    const newUser = await User.create({
      name: "Test User",
      email: `test-${Math.random()}@example.com`,
    });

    return Response.json({ 
      message: "🚀 Data saved successfully!", 
      user: newUser 
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}