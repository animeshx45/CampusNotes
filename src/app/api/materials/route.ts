import { NextResponse } from 'next/server';
import { prisma } from '@/lib/cockroachdb';

// GET /api/materials - Get all study materials (optional filtering by branch/semester)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get('branch');
    const semester = searchParams.get('semester');

    const where: any = {};
    if (branch && branch !== 'all') {
      where.branch = branch;
    }
    if (semester && semester !== 'all') {
      const semNum = parseInt(semester);
      if (!isNaN(semNum)) {
        where.semester = semNum;
      }
    }

    // Return materials sorted by newest first
    const materials = await prisma.studyMaterial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Map CockroachDB UUID `id` to match the existing API shape
    const data = materials.map((m) => ({
      ...m,
      id: m.id, // UUID string — replaces the old MongoDB _id
    }));

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Failed to fetch materials:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/materials - Create a new study material
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subject, description, branch, semester, type, fileUrl, author, uploaderId, folderFiles } = body;

    if (!title || !description || !branch || !semester || !type || !fileUrl || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanSubject = (subject || 'General').trim();

    const newMaterial = await prisma.studyMaterial.create({
      data: {
        title,
        subject: cleanSubject,
        description,
        branch,
        semester: Number(semester),
        type,
        fileUrl,
        author,
        uploaderId: uploaderId || 'public-user',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        folderFiles: folderFiles && folderFiles.length > 0 ? folderFiles : undefined,
      },
    });

    return NextResponse.json({ data: newMaterial });
  } catch (error: any) {
    console.error('Failed to create material:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
