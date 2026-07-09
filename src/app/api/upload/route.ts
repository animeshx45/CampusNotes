import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import MaterialFile from '@/lib/models/MaterialFile';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Please log in first.' }, { status: 401 });
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (!decoded || !decoded.id) {
        return NextResponse.json({ error: 'Unauthorized: Invalid authentication token.' }, { status: 401 });
      }
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized: Expired or invalid token.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // In development mode, save the file to local disk (public/uploads) to prevent slow remote GridFS uploads
    if (process.env.NODE_ENV === 'development') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const safeFileName = `${Date.now()}-${cleanName}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

      await fs.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, safeFileName);
      await fs.writeFile(filePath, buffer);

      console.log(`[Dev Mode] Saved file to local disk: ${filePath} (${buffer.length} bytes)`);

      const fileUrl = `/api/upload?id=${safeFileName}`;
      return NextResponse.json({ url: fileUrl });
    }

    await connectToDatabase();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to MaterialFile model in MongoDB (fast, no stream/timeout issues on serverless)
    const newFile = await MaterialFile.create({
      fileName: file.name,
      contentType: file.type || 'application/pdf',
      data: buffer.toString('base64')
    });

    const fileId = newFile._id.toString();
    const fileUrl = `/api/upload?id=${fileId}`;

    console.log(`Saved file to MaterialFile: ${file.name} (ID: ${fileId}, Size: ${buffer.length} bytes)`);

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('MaterialFile upload error:', error);
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

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      // Check if it's a file saved locally in development mode
      try {
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileId);
        // Check if file exists
        await fs.access(filePath);
        
        // Read file contents
        const fileBuffer = await fs.readFile(filePath);
        
        // Determine content type
        let contentType = 'application/pdf';
        if (fileId.toLowerCase().endsWith('.png')) {
          contentType = 'image/png';
        } else if (fileId.toLowerCase().endsWith('.jpg') || fileId.toLowerCase().endsWith('.jpeg')) {
          contentType = 'image/jpeg';
        } else if (fileId.toLowerCase().endsWith('.webp')) {
          contentType = 'image/webp';
        } else if (fileId.toLowerCase().endsWith('.gif')) {
          contentType = 'image/gif';
        }

        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${encodeURIComponent(fileId)}"`,
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      } catch (err) {
        return new NextResponse('Invalid File ID format or local file not found', { status: 400 });
      }
    }

    await connectToDatabase();
    const conn = mongoose.connection;
    if (!conn.db) {
      throw new Error('Database connection not established');
    }

    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'study_materials',
      chunkSizeBytes: 2 * 1024 * 1024
    });

    const objectId = new mongoose.Types.ObjectId(fileId);

    // 1. Try to find the file in GridFS
    const files = await bucket.find({ _id: objectId }).toArray();

    if (!files || files.length === 0) {
      // 2. Fallback to old MaterialFile schema
      const oldFile = await MaterialFile.findById(fileId);
      if (oldFile) {
        const oldBuffer = Buffer.from(oldFile.data, 'base64');
        return new NextResponse(oldBuffer, {
          headers: {
            'Content-Type': oldFile.contentType || 'application/pdf',
            'Content-Disposition': `inline; filename="${encodeURIComponent(oldFile.fileName)}"`,
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      }
      return new NextResponse('File not found', { status: 404 });
    }

    const fileRecord = files[0];
    const downloadStream = bucket.openDownloadStream(objectId);

    // Read the stream into a single buffer to guarantee safe serverless delivery on environments like Vercel
    const chunks: any[] = [];
    await new Promise<void>((resolve, reject) => {
      downloadStream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
      downloadStream.on('end', () => resolve());
      downloadStream.on('error', (err: any) => reject(err));
    });

    const fileBuffer = Buffer.concat(chunks);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': (fileRecord.metadata as any)?.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(fileRecord.filename)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error: any) {
    console.error('File retrieval error:', error);
    return new NextResponse(`Error retrieving file: ${error.message}`, { status: 500 });
  }
}
