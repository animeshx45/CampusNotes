import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { prisma } from '@/lib/cockroachdb';
import ForumPost from '@/lib/models/ForumPost';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch users & forum posts from MongoDB, materials from CockroachDB
    const [users, materials, posts] = await Promise.all([
      User.find({}, { password: 0 }).lean(),
      prisma.studyMaterial.findMany({ where: { status: 'approved' } }),
      ForumPost.find({}).lean(),
    ]);

    const contributorsList = users.map((user: any) => {
      const userIdStr = user._id.toString();
      const userFullNameLower = (user.fullName || '').toLowerCase().trim();
      const userUsernameLower = (user.username || '').toLowerCase().trim();

      let xp = 0;
      let materialsCount = 0;
      let postsCount = 0;
      let repliesCount = 0;

      // 1. Calculate XP from study materials
      materials.forEach((mat: any) => {
        const matUploaderId = (mat.uploaderId || '').toString();
        const matAuthorLower = (mat.author || '').toLowerCase().trim();

        if (
          matUploaderId === userIdStr ||
          (matAuthorLower && (matAuthorLower === userFullNameLower || matAuthorLower === userUsernameLower))
        ) {
          xp += 150;
          materialsCount++;
        }
      });

      // 2. Calculate XP from forum posts and replies
      posts.forEach((post: any) => {
        const postAuthorId = (post.authorId || '').toString();
        const postAuthorNameLower = (post.authorName || '').toLowerCase().trim();

        if (
          postAuthorId === userIdStr ||
          (postAuthorNameLower && (postAuthorNameLower === userFullNameLower || postAuthorNameLower === userUsernameLower))
        ) {
          xp += 100;
          postsCount++;
        }

        // Check replies
        if (Array.isArray(post.replies)) {
          post.replies.forEach((reply: any) => {
            const replyAuthorId = (reply.authorId || '').toString();
            const replyAuthorNameLower = (reply.authorName || '').toLowerCase().trim();

            if (
              replyAuthorId === userIdStr ||
              (replyAuthorNameLower && (replyAuthorNameLower === userFullNameLower || replyAuthorNameLower === userUsernameLower))
            ) {
              xp += 50;
              repliesCount++;
            }
          });
        }
      });

      return {
        id: userIdStr,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        branch: user.branch,
        xp,
        contributions: {
          materials: materialsCount,
          posts: postsCount,
          replies: repliesCount,
        },
      };
    });

    // Sort by XP descending, then by username alphabetically
    contributorsList.sort((a: any, b: any) => {
      if (b.xp !== a.xp) {
        return b.xp - a.xp;
      }
      return a.username.localeCompare(b.username);
    });

    return NextResponse.json({ data: contributorsList });
  } catch (error: any) {
    console.error('Failed to fetch contributors:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
