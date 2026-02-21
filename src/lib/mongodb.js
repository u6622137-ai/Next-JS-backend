// src/lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGODB;

if (!uri) {
  throw new Error("Missing MongoDB connection string. Set MONGODB_URI (or MONGODB) in your env.");
}

const options = {};

let client;
let clientPromise;

// In development, use a global variable so the client is reused across HMR reloads
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for the server
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ✅ This matches what your routes import: getClientPromise()
export async function getClientPromise() {
  return clientPromise;
}