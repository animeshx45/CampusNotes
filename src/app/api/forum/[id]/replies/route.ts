import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ForumPost from '@/lib/models/ForumPost';
import mongoose from 'mongoose';

// POST /api/forum/[id]/replies - Add a reply to a post
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, authorId, authorName } = body;

    if (!content || !authorId || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectToDatabase();

    const post = await ForumPost.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Add reply to subdocument array
    post.replies.push({
      content,
      authorId,
      authorName
    });

    await post.save();

    // Return the newly created reply
    const newReply = post.replies[post.replies.length - 1];
    return NextResponse.json({ data: newReply });
  } catch (error: any) {
    console.error('Failed to add reply:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/forum/[id]/replies - Delete a reply from a post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { searchParams } = new URL(request.url);
    const replyId = searchParams.get('replyId');

    if (!replyId || !mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(replyId)) {
      return NextResponse.json({ error: 'Invalid Post ID or Reply ID' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Pull the reply with the specified ID
    const updatedPost = await ForumPost.findByIdAndUpdate(
      postId,
      { $pull: { replies: { _id: new mongoose.Types.ObjectId(replyId) } } },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: 'Forum post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete reply:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/forum/[id]/replies - Edit a reply content
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await request.json();
    const { replyId, content } = body;

    if (!replyId || !content || !mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(replyId)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Update the specific reply subdocument
    const updatedPost = await ForumPost.findOneAndUpdate(
      { _id: postId, 'replies._id': new mongoose.Types.ObjectId(replyId) },
      { $set: { 'replies.$.content': content } },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: 'Forum post or reply not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to update reply:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
