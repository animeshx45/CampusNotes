



















import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import StudyMaterial from '@/lib/models/StudyMaterial';
import mongoose from 'mongoose';

// GET /api/materials/[id] - Get a single material
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (id.startsWith('fallback-')) {
      const companyName = id.replace('fallback-', '').toUpperCase();
      const isDeloitte = companyName === 'DELLOITE' || companyName === 'DELLIOTE' || companyName === 'DELOITTE';
      const formattedSubject = isDeloitte ? 'Delloite' : (companyName.charAt(0) + companyName.slice(1).toLowerCase());
      
      const fallbackMaterial = {
        id,
        title: `${formattedSubject} Placement Materials`,
        subject: formattedSubject,
        description: `${formattedSubject}-specific placement prep materials, including past papers, coding questions, and interview preparation resources.`,
        branch: 'Placement Materials',
        semester: 8,
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

    // Check if it's a valid ObjectId first. If it's a mock ID (starts with CSE, common, etc.), return null
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    await connectToDatabase();
    let material = await StudyMaterial.findById(id).lean();

    if (!material) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    if (material.type === 'Folder' && material.branch === 'Placement Materials') {
      const isDeloitte = material.subject.toUpperCase().includes('DELLOITE') || 
                         material.subject.toUpperCase().includes('DELLIOTE') || 
                         material.subject.toUpperCase().includes('DELOITTE');
      
      const subjectRegex = isDeloitte 
        ? 'delloite|delliote|deloitte' 
        : material.subject;

      const files = await StudyMaterial.find({
        branch: 'Placement Materials',
        subject: { $regex: new RegExp(subjectRegex, 'i') },
        _id: { $ne: new mongoose.Types.ObjectId(id) }
      }).lean();

      const folderFiles: any[] = [];
      files.forEach((f: any) => {
        if (f.type === 'Folder') {
          if (f.folderFiles && Array.isArray(f.folderFiles)) {
            f.folderFiles.forEach((file: any) => {
              folderFiles.push({
                name: file.name,
                fileUrl: file.fileUrl,
                type: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image')
              });
            });
          }
        } else {
          folderFiles.push({
            name: f.title,
            fileUrl: f.fileUrl,
            type: f.type === 'image' ? 'image' : 'pdf'
          });
        }
      });

      material.folderFiles = folderFiles;
    }

    return NextResponse.json({ data: material });
  } catch (error: any) {
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectToDatabase();

    // Support increments (like incrementing views or downloads) or full edits
    const updateData: any = {};
    if (body.incrementViews) {
      updateData.$inc = { views: 1 };
    } else if (body.incrementDownloads) {
      updateData.$inc = { downloadCount: 1 };
    } else {
      // Normal update
      Object.assign(updateData, body);
    }

    const updatedMaterial = await StudyMaterial.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedMaterial) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedMaterial });
  } catch (error: any) {
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectToDatabase();
    const deletedMaterial = await StudyMaterial.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete material:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
