import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import MaterialFile from '@/lib/models/MaterialFile';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean file name to prevent directory traversal or invalid characters
    const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const safeFileName = `${Date.now()}-${cleanName}`;

    // Define public/uploads directory path
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Write file to local disk
    const filePath = path.join(uploadsDir, safeFileName);
    await fs.writeFile(filePath, buffer);

    console.log(`Saved file to disk: ${filePath} (${buffer.length} bytes)`);

    // Return the public URL
    const fileUrl = `/uploads/${safeFileName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('File system upload error:', error);
    return NextResponse.json({ error: `Failed to upload file: ${error.message}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return new NextResponse('File ID parameter is required', { status: 400 });
    }

    await connectToDatabase();
    const fileRecord = await MaterialFile.findById(fileId);

    if (!fileRecord) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = Buffer.from(fileRecord.data, 'base64');

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': fileRecord.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(fileRecord.fileName)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error: any) {
    console.error('File retrieval error:', error);
    return new NextResponse(`Error retrieving file: ${error.message}`, { status: 500 });
  }
}
