import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/cockroachdb';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Authenticate via JWT cookie
async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) throw new Error('UNAUTHORIZED');
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded?.id) throw new Error('UNAUTHORIZED');
    return decoded;
  } catch {
    throw new Error('UNAUTHORIZED');
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticate();

    const contentType = request.headers.get('content-type') || '';

    // ── JSON body: "init" or "complete" actions ──
    if (contentType.includes('application/json')) {
      const body = await request.json();

      if (body.action === 'init') {
        // Generate a unique session ID for this upload
        const sessionId = `up_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        return NextResponse.json({ sessionId });
      }

      if (body.action === 'complete') {
        const { sessionId, fileName, fileContentType, totalChunks } = body;
        if (!sessionId || !totalChunks) {
          return NextResponse.json({ error: 'Missing sessionId or totalChunks' }, { status: 400 });
        }

        // Verify all chunks exist
        const chunkCount = await prisma.uploadChunk.count({
          where: { sessionId },
        });
        if (chunkCount < totalChunks) {
          return NextResponse.json({
            error: `Only ${chunkCount}/${totalChunks} chunks received. Please retry the upload.`
          }, { status: 400 });
        }

        // Retrieve all chunks in order
        const chunks = await prisma.uploadChunk.findMany({
          where: { sessionId },
          orderBy: { chunkIndex: 'asc' },
        });

        // Verify sequential completeness
        for (let i = 0; i < totalChunks; i++) {
          if (!chunks[i] || chunks[i].chunkIndex !== i) {
            return NextResponse.json({ error: `Missing chunk ${i}` }, { status: 400 });
          }
        }

        // Assemble all chunk buffers into a single file buffer
        const fileBuffer = Buffer.concat(
          chunks.map((c) => Buffer.from(c.data))
        );

        // Store the assembled file in CockroachDB
        const finalFileName = fileName || 'file.pdf';
        const materialFile = await prisma.materialFile.create({
          data: {
            fileName: finalFileName,
            contentType: fileContentType || 'application/pdf',
            data: new Uint8Array(fileBuffer),
          },
        });

        // Clean up temp chunks in the background
        prisma.uploadChunk.deleteMany({ where: { sessionId } }).catch(() => {});

        const fileUrl = `/api/upload?id=${materialFile.id}`;
        console.log(`Chunked upload complete: ${finalFileName} → CockroachDB ${materialFile.id} (${totalChunks} chunks)`);
        return NextResponse.json({ url: fileUrl });
      }

      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // ── FormData body: chunk upload ──
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const sessionId = formData.get('sessionId') as string;
      const chunkIndex = parseInt(formData.get('chunkIndex') as string, 10);
      const chunkBlob = formData.get('chunk') as Blob | null;

      if (!sessionId || isNaN(chunkIndex) || !chunkBlob) {
        return NextResponse.json({ error: 'Missing sessionId, chunkIndex, or chunk data' }, { status: 400 });
      }

      const bytes = await chunkBlob.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upsert: if the client retries a chunk, overwrite it
      await prisma.uploadChunk.upsert({
        where: {
          sessionId_chunkIndex: { sessionId, chunkIndex },
        },
        update: { data: new Uint8Array(buffer) },
        create: { sessionId, chunkIndex, data: new Uint8Array(buffer) },
      });

      return NextResponse.json({ ok: true, chunk: chunkIndex });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
    }
    console.error('Upload chunk error:', error);
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
