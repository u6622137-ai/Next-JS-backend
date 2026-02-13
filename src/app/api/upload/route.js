import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import corsHeaders from '@/lib/cors';
import { mkdir } from 'fs/promises';

export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400, headers: corsHeaders });
        }

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400, headers: corsHeaders });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unguessable name
        const extension = path.extname(file.name) || '.png';
        const fileName = crypto.randomBytes(16).toString('hex') + extension;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${fileName}`
        }, { headers: corsHeaders });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
