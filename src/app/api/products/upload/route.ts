import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
        }
        const formData = await request.formData();
        const imageFile = formData.get('image') as File | null;
        if (!imageFile || typeof imageFile !== 'object') {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        const fileName = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);
        const imagePath = `/uploads/${fileName}`;
        return NextResponse.json({ imagePath }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to upload image', details: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const imagePath = searchParams.get('imagePath');
        if (!imagePath) {
            return NextResponse.json({ error: 'No imagePath provided' }, { status: 400 });
        }
        const filePath = path.join(process.cwd(), 'public', imagePath);
        await fs.unlink(filePath);
        return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete image', details: (error as Error).message }, { status: 500 });
    }
}
