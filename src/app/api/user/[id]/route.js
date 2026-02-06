import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

export async function PATCH(req, { params }) {
    const { id } = await params;
    const data = await req.json();
    const partialUpdate = {};

    if (data.username != null) partialUpdate.username = data.username;
    if (data.email != null) partialUpdate.email = data.email;
    if (data.firstName != null) partialUpdate.firstName = data.firstName;
    if (data.lastName != null) partialUpdate.lastName = data.lastName;
    if (data.password != null) partialUpdate.password = data.password;
    if (data.status != null) partialUpdate.status = data.status;

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

export async function PUT(req, { params }) {
    const { id } = await params;
    const data = await req.json();
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");

        const { _id, ...updateData } = data;

        const updatedResult = await db.collection("user").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return NextResponse.json(updatedResult, { status: 200, headers: corsHeaders });
    } catch (exception) {
        return NextResponse.json({ message: exception.toString() }, { status: 400, headers: corsHeaders });
    }
}

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
