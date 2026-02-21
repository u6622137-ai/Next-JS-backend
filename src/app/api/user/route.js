import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db
      .collection("user")
      .find({}, { projection: { password: 0 } }) // hide password
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { message: err?.message || String(err) },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const client = await getClientPromise();
    const db = client.db("wad-01");
    const collection = db.collection("user");

    const doc = {
      username: data.username,
      email: data.email,
      firstName: data.firstName || data.firstname || null,
      lastName: data.lastName || data.lastname || null,
      password: data.password || null, // (hash later)
      status: data.status || "ACTIVE",
      profileImage: data.profileImage || null,
      createdAt: new Date(),
    };

    // basic validation
    if (!doc.username || !doc.email) {
      return NextResponse.json(
        { ok: false, message: "username and email are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      { ok: true, id: result.insertedId },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: err?.message || String(err) },
      { status: 500, headers: corsHeaders }
    );
  }
}