import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const globalWithMongoose = global as typeof globalThis & {
  mongoose: any;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "smartCompare",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}