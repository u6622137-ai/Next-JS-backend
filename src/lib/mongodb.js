import { MongoClient } from "mongodb";
<<<<<<< HEAD

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export function getClientPromise() {
  return clientPromise;
}
=======
const options = {};
let globalClientPromise;
export function getClientPromise() {
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local or set MONGODB_URIenv variable");
}
if (process.env.NODE_ENV === "development") {
if (!globalClientPromise) {
const client = new MongoClient(uri, options);
globalClientPromise = client.connect();
}
return globalClientPromise;
} else {const client = new MongoClient(uri, options);
return client.connect();
}
}
>>>>>>> d5d954e4645416031a5eadfd9b9a5ac3c70e21d4
