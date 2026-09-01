import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
let mongoDisabled = false;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export function isMongoConfigured(): boolean {
  return Boolean(
    !mongoDisabled && MONGODB_URI && MONGODB_URI.startsWith("mongodb")
  );
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    mongoDisabled = true;
    cached.promise = null;
    throw error;
  }
}
