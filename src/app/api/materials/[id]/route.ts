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

    // Check if it's a valid ObjectId first. If it's a mock ID (starts with CSE, common, etc.), return null
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    await connectToDatabase();
    const material = await StudyMaterial.findById(id);

    if (!material) {
      return NextResponse.json({ data: null }, { status: 404 });
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
