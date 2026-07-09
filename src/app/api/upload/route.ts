import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import MaterialFile from '@/lib/models/MaterialFile';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

    await connectToDatabase();
    const conn = mongoose.connection;
    if (!conn.db) {
      throw new Error('Database connection not established');
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'study_materials',
      chunkSizeBytes: 2 * 1024 * 1024 // 2MB chunks to reduce network latency roundtrips
    });

    // Create upload stream to GridFS
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        originalName: file.name,
        contentType: file.type || 'application/pdf'
      }
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await new Promise<void>((resolve, reject) => {
      uploadStream.on('error', (err: any) => reject(err));
      uploadStream.on('finish', () => resolve());
      uploadStream.write(buffer);
      uploadStream.end();
    });

    const fileId = uploadStream.id.toString();
    const fileUrl = `/api/upload?id=${fileId}`;

    console.log(`Saved file to GridFS: ${file.name} (ID: ${fileId}, Size: ${buffer.length} bytes)`);

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('GridFS upload error:', error);
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
      return new NextResponse('Invalid File ID format', { status: 400 });
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

    // 3. Stream data chunk by chunk via TransformStream (production/serverless safe)
    const passThrough = new TransformStream();
    const writer = passThrough.writable.getWriter();
    
    downloadStream.on('data', (chunk: any) => {
      writer.write(chunk);
    });
    
    downloadStream.on('end', () => {
      writer.close();
    });
    
    downloadStream.on('error', (err: any) => {
      writer.abort(err);
    });

    return new NextResponse(passThrough.readable, {
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
