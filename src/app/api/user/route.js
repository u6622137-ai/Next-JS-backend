import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");

        const result = await db.collection("user")
            .find({})
            .skip(skip)
            .limit(limit)
            .toArray();

        return NextResponse.json(result, {
            headers: corsHeaders
        });
    } catch (exception) {
        return NextResponse.json({ message: exception.toString() }, {
            status: 400,
            headers: corsHeaders
        });
    }
}

export async function POST(req) {
    const data = await req.json();
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");

        const result = await db.collection("user").insertOne({
            username: data.username,
            email: data.email,
<<<<<<< HEAD
            firstname: data.firstname,
            lastname: data.lastname,
            status: data.status || "ACTIVE",
            profileImage: data.profileImage || null
=======
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            status: "ACTIVE"
>>>>>>> d5d954e4645416031a5eadfd9b9a5ac3c70e21d4
        });

        return NextResponse.json({ id: result.insertedId }, {
            status: 200,
            headers: corsHeaders
        });
    } catch (exception) {
        return NextResponse.json({ message: exception.toString() }, {
            status: 400,
            headers: corsHeaders
        });
    }
}
