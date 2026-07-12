import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import StudyMaterial from '@/lib/models/StudyMaterial';

// GET /api/materials - Get all study materials (optional filtering by branch/semester)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get('branch');
    const semester = searchParams.get('semester');

    await connectToDatabase();

    const query: any = {};
    if (branch && branch !== 'all') {
      query.branch = branch;
    }
    if (semester && semester !== 'all') {
      const semNum = parseInt(semester);
      if (!isNaN(semNum)) {
        query.semester = semNum;
      }
    }

    // Return materials sorted by newest first
    const materials = await StudyMaterial.find(query).sort({ createdAt: -1 }).lean();

    // Map MongoDB `_id` to match expected client-side `id` shape
    const data = materials.map((m: any) => ({
      ...m,
      id: m._id.toString(),
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

    await connectToDatabase();

    const newMaterial = await StudyMaterial.create({
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
      folderFiles: folderFiles || []
    });

    return NextResponse.json({ data: newMaterial });
  } catch (error: any) {
    console.error('Failed to create material:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
