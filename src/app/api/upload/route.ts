import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import MaterialFile from '@/lib/models/MaterialFile';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';
import { Readable } from 'stream';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // --- Auth check ---
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

    // --- Parse the incoming file ---
    let fileBuffer: Buffer;
    let fileName: string;
    let contentType: string;

    const requestContentType = request.headers.get('content-type') || '';

    if (requestContentType.includes('multipart/form-data')) {
      // Client sent FormData with a 'file' field
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }, { status: 413 });
      }
      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
      fileName = file.name;
      contentType = file.type || 'application/pdf';
    } else {
      // Client sent raw binary with headers
      const fileNameHeader = request.headers.get('x-file-name') || 'file.pdf';
      fileName = decodeURIComponent(fileNameHeader);
      contentType = requestContentType || 'application/pdf';
      const bytes = await request.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
    }

    if (fileBuffer.length === 0) {
      return NextResponse.json({ error: 'No file provided or empty payload' }, { status: 400 });
    }

    if (fileBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File too large (${(fileBuffer.length / (1024 * 1024)).toFixed(1)}MB). Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }, { status: 413 });
    }

    // --- Development mode: save to local disk ---
    if (process.env.NODE_ENV === 'development') {
      const cleanName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const safeFileName = `${Date.now()}-${cleanName}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

      await fs.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, safeFileName);
      await fs.writeFile(filePath, fileBuffer);

      console.log(`[Dev Mode] Saved file to local disk: ${filePath} (${fileBuffer.length} bytes)`);

      const fileUrl = `/api/upload?id=${safeFileName}`;
      return NextResponse.json({ url: fileUrl });
    }

    // --- Production: Upload to MongoDB GridFS ---
    // GridFS stores files in 255KB chunks, avoiding the 16MB BSON document limit.
    // This replaces the old MaterialFile base64 approach.
    await connectToDatabase();
    const conn = mongoose.connection;
    if (!conn.db) {
      throw new Error('Database connection not established');
    }

    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'study_materials',
      chunkSizeBytes: 2 * 1024 * 1024 // 2MB chunks for efficiency
    });

    // Upload the file to GridFS using a stream
    const fileId = await new Promise<string>((resolve, reject) => {
      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);

      const uploadStream = bucket.openUploadStream(fileName, {
        metadata: {
          contentType: contentType,
          originalName: fileName,
          uploadedAt: new Date().toISOString(),
          sizeBytes: fileBuffer.length
        }
      });

      readableStream.pipe(uploadStream);

      uploadStream.on('finish', () => {
        resolve(uploadStream.id.toString());
      });

      uploadStream.on('error', (err) => {
        reject(err);
      });
    });

    const fileUrl = `/api/upload?id=${fileId}`;

    console.log(`Saved file to GridFS: ${fileName} (ID: ${fileId}, Size: ${fileBuffer.length} bytes)`);

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('Upload error:', error);

    // Provide a user-friendly error message
    if (error.message?.includes('PayloadTooLargeError') || error.message?.includes('body exceeded')) {
      return NextResponse.json({ error: 'File is too large for the server to handle. Please use a smaller file.' }, { status: 413 });
    }

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
        let ct = 'application/pdf';
        if (fileId.toLowerCase().endsWith('.png')) {
          ct = 'image/png';
        } else if (fileId.toLowerCase().endsWith('.jpg') || fileId.toLowerCase().endsWith('.jpeg')) {
          ct = 'image/jpeg';
        } else if (fileId.toLowerCase().endsWith('.webp')) {
          ct = 'image/webp';
        } else if (fileId.toLowerCase().endsWith('.gif')) {
          ct = 'image/gif';
        }

        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': ct,
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
      // 2. Fallback to old MaterialFile schema (legacy base64 storage)
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

    // Read the stream into a single buffer to guarantee safe serverless delivery
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
