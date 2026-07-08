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
