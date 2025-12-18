// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not found in environment variables");
}

/** * Global is used here to maintain a cached connection across hot reloads
 * during development. This prevents connections from growing exponentially.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // 1. If we have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // 2. If we don't have a promise, start a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents Mongoose from hanging if connection drops
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  // 3. Wait for the promise to resolve and cache the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on error so next attempt tries again
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;