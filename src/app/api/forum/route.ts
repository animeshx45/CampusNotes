import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ForumPost from '@/lib/models/ForumPost';

// GET /api/forum - List all forum posts (optional branch filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get('branch');

    await connectToDatabase();

    const query: any = {};
    if (branch && branch !== 'all') {
      query.branch = branch;
    }

    const posts = await ForumPost.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ data: posts });
  } catch (error: any) {
    console.error('Failed to fetch forum posts:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/forum - Create a new forum post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, authorId, authorName, branch } = body;

    if (!title || !content || !authorId || !authorName || !branch) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const newPost = await ForumPost.create({
      title,
      content,
      authorId,
      authorName,
      branch,
      replies: []
    });

    return NextResponse.json({ data: newPost });
  } catch (error: any) {
    console.error('Failed to create forum post:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
