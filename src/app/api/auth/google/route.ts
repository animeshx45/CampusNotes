import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(request: Request) {
  try {
    const { uid, email, displayName } = await request.json();

    if (!uid || !email) {
      return NextResponse.json({ error: 'UID and email are required' }, { status: 400 });
    }

    await connectToDatabase();

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        fullName: displayName || 'Google Student',
        email: email.toLowerCase(),
        username: email.split('@')[0] || uid,
        password: 'google-oauth-password-placeholder-' + uid,
        role: 'student',
        branch: null,
        semester: null,
      });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Google Auth login error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
