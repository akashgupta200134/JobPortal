import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  try {
    await connectDB();
    console.log("Attempting to create user...");

    // We hardcode the values directly here to bypass any request issues
    const testData = {
      role: "candidate", 
      phone: "TEST-" + Math.random().toString(36).substring(7), // Generates a random unique string
      fullName: "Akash Test",
      email: "akash@test.com"
    };

    const newUser = await User.create(testData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "User created!", 
      user: newUser 
    }), { status: 201 });

  } catch (error) {
    console.error("Mongoose Error:", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { status: 500 });
  }
}