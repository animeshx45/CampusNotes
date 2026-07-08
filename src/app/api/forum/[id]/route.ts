import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ForumPost from '@/lib/models/ForumPost';
import mongoose from 'mongoose';

// GET /api/forum/[id] - Get a single forum post (includes nested replies)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    await connectToDatabase();
    const post = await ForumPost.findById(id);

    if (!post) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error: any) {
    console.error('Failed to fetch forum post:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/forum/[id] - Delete a forum post
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
    const deletedPost = await ForumPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: 'Forum post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete forum post:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/forum/[id] - Edit a forum post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectToDatabase();
    const updatedPost = await ForumPost.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: 'Forum post not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedPost });
  } catch (error: any) {
    console.error('Failed to update forum post:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
