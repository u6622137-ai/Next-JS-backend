// src/lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGODB;

if (!uri && process.env.NODE_ENV === "production") {
  console.warn("Warning: MONGODB_URI is missing. This is fine during build if not pre-rendering data.");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    if (!uri) throw new Error("Missing MONGODB_URI in development");
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, only create the client if we have a URI
  if (uri) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getClientPromise() {
  if (!uri) {
    throw new Error("Missing MongoDB connection string. Set MONGODB_URI in your environment variables.");
  }
  return clientPromise;
}