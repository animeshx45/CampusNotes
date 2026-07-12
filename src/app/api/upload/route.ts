import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/cockroachdb';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

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

    // --- Production: Store file in CockroachDB via Prisma ---
    const materialFile = await prisma.materialFile.create({
      data: {
        fileName,
        contentType,
        data: new Uint8Array(fileBuffer), // Cast to Uint8Array for Prisma Bytes type
      },
    });

    const fileUrl = `/api/upload?id=${materialFile.id}`;

    console.log(`Saved file to CockroachDB: ${fileName} (ID: ${materialFile.id}, Size: ${fileBuffer.length} bytes)`);

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

    // --- Check if it's a local dev file (not a UUID) ---
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!UUID_REGEX.test(fileId)) {
      // Try to serve from local disk (dev mode uploads)
      try {
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileId);
        // Check if file exists
        await fs.access(filePath);

        // Read file contents
        const localBuffer = await fs.readFile(filePath);

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

        return new NextResponse(localBuffer, {
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

    // --- Production: Retrieve from CockroachDB via Prisma ---
    const materialFile = await prisma.materialFile.findUnique({
      where: { id: fileId },
    });

    if (!materialFile) {
      return new NextResponse('File not found', { status: 404 });
    }

    // materialFile.data is a Buffer (Prisma Bytes type)
    const buffer = Buffer.from(materialFile.data);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': materialFile.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(materialFile.fileName)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error: any) {
    console.error('File retrieval error:', error);
    return new NextResponse(`Error retrieving file: ${error.message}`, { status: 500 });
  }
}
