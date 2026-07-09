import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ user: null });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    const userObj = user.toObject();
    const adminEmail = (process.env.ADMIN_EMAIL || 'rajur@nitsri.ac.in').toLowerCase();
    if (userObj.email.toLowerCase() === adminEmail) {
      userObj.role = 'admin';
    }

    return NextResponse.json({ user: userObj });
  } catch (error: any) {
    console.error('API /me error:', error);
    try {
      const cookieStore = await cookies();
      cookieStore.delete('token');
    } catch {}
    return NextResponse.json({ user: null });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, username, branch, semester } = body;

    if (!fullName || !username) {
      return NextResponse.json({ error: 'Full Name and Username are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if username is already taken by another user
    const existingUser = await User.findOne({ username, _id: { $ne: decoded.id } });
    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { fullName, username, branch, semester: semester ? parseInt(semester) : null },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userObj = updatedUser.toObject();
    const adminEmail = (process.env.ADMIN_EMAIL || 'rajur@nitsri.ac.in').toLowerCase();
    if (userObj.email.toLowerCase() === adminEmail) {
      userObj.role = 'admin';
    }

    return NextResponse.json({ success: true, user: userObj });
  } catch (error: any) {
    console.error('API PUT /me error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

