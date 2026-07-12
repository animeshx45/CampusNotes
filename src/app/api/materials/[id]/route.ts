



















import { NextResponse } from 'next/server';
import { prisma } from '@/lib/cockroachdb';

// GET /api/materials/[id] - Get a single material
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (id.startsWith('fallback-')) {
      const companyName = id.replace('fallback-', '').toUpperCase();
      const formattedSubject = companyName === 'DELLOITE' ? 'Delloite' : (companyName.charAt(0) + companyName.slice(1).toLowerCase());
      
      const fallbackMaterial = {
        id,
        title: `${formattedSubject} Placement Materials`,
        subject: formattedSubject,
        description: `${formattedSubject}-specific placement prep materials, including past papers, coding questions, and interview preparation resources.`,
        branch: 'Placement Materials',
        semester: 1,
        type: 'Folder',
        fileUrl: 'folder',
        author: 'Training & Placement Cell',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        folderFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return NextResponse.json({ data: fallbackMaterial });
    }

    const material = await prisma.studyMaterial.findUnique({
      where: { id },
    });

    if (!material) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    return NextResponse.json({ data: material });
  } catch (error: any) {
    // If the id is not a valid UUID, Prisma throws — treat as 404
    if (error.code === 'P2023' || error.message?.includes('Malformed ObjectID')) {
      return NextResponse.json({ data: null }, { status: 404 });
    }
    console.error('Failed to fetch material:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/materials/[id] - Update a material (e.g. edit it, or increment views/downloads)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (id.startsWith('fallback-')) {
      return NextResponse.json({ data: { id, success: true } });
    }

    const body = await request.json();

    // Build the update payload
    let updateData: any = {};

    if (body.incrementViews) {
      // Prisma doesn't have $inc — use an atomic increment
      updateData = { views: { increment: 1 } };
    } else if (body.incrementDownloads) {
      updateData = { downloadCount: { increment: 1 } };
    } else {
      // Normal full update — pick only known fields to prevent overwriting system columns
      const { title, subject, description, branch, semester, type, fileUrl, author, uploaderId, status, folderFiles } = body;
      updateData = {
        ...(title !== undefined && { title }),
        ...(subject !== undefined && { subject }),
        ...(description !== undefined && { description }),
        ...(branch !== undefined && { branch }),
        ...(semester !== undefined && { semester: Number(semester) }),
        ...(type !== undefined && { type }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(author !== undefined && { author }),
        ...(uploaderId !== undefined && { uploaderId }),
        ...(status !== undefined && { status }),
        ...(folderFiles !== undefined && { folderFiles }),
      };
    }

    const updatedMaterial = await prisma.studyMaterial.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: updatedMaterial });
  } catch (error: any) {
    // P2025 = record not found
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }
    if (error.code === 'P2023') {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    console.error('Failed to update material:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/materials/[id] - Delete a material
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (id.startsWith('fallback-')) {
      return NextResponse.json({ success: true });
    }

    await prisma.studyMaterial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }
    if (error.code === 'P2023') {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    console.error('Failed to delete material:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
