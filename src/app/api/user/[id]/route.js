import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Headers to prevent caching issues
const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    ...corsHeaders
};

export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}

// GET: Fetch a single user
export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");
        const result = await db.collection("user").findOne({ _id: new ObjectId(id) });

        return NextResponse.json(result, { headers: noCacheHeaders });
    } catch (exception) {
        return NextResponse.json({ message: exception.toString() }, { status: 400, headers: corsHeaders });
    }
}

// PATCH: Partially update specific fields
export async function PATCH(req, { params }) {
    const { id } = await params;
    const data = await req.json();
    const partialUpdate = {};

    if (data.username != null) partialUpdate.username = data.username;
    if (data.email != null) partialUpdate.email = data.email;
    if (data.firstname != null) partialUpdate.firstname = data.firstname;
    if (data.lastname != null) partialUpdate.lastname = data.lastname;
    if (data.status != null) partialUpdate.status = data.status;
    if (data.profileImage != null) partialUpdate.profileImage = data.profileImage;

    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");

        const updatedResult = await db.collection("user").updateOne(
            { _id: new ObjectId(id) },
            { $set: partialUpdate }
        );

        return NextResponse.json(updatedResult, { status: 200, headers: corsHeaders });
    } catch (exception) {
        return NextResponse.json({ message: exception.toString() }, { status: 400, headers: corsHeaders });
    }
}

// PUT: Replace/Update entire user
export async function PUT(req, { params }) {
    const { id } = await params;
    const data = await req.json();
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");

        const { _id, ...updateData } = data;
        // Ensure profileImage is included if present
        if (data.profileImage) updateData.profileImage = data.profileImage;

        const updatedResult = await db.collection("user").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return NextResponse.json(updatedResult, { status: 200, headers: corsHeaders });
    } catch (exception) {
        return NextResponse.json({ message: exception.toString() }, { status: 400, headers: corsHeaders });
    }
}

// DELETE: Remove a user permanently
export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");

        const result = await db.collection("user").deleteOne({
            _id: new ObjectId(id)
        });

        return NextResponse.json(result, { status: 200, headers: corsHeaders });
    } catch (exception) {
        return NextResponse.json({ message: exception.toString() }, { status: 400, headers: corsHeaders });
    }
}
