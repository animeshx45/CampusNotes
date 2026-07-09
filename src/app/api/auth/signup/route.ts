import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(request: Request) {
  try {
    const { name, email, password, role, branch, semester, otp } = await request.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json({ error: 'Name, email, password, and verification OTP are required' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Verify OTP
    const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
    if (!otpRecord || otpRecord.otp !== otp) {
      return NextResponse.json({ error: 'Invalid or expired verification OTP' }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'rajur@nitsri.ac.in').toLowerCase();
    const finalRole = role === 'admin' && email.toLowerCase() !== adminEmail ? 'student' : role;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: name,
      email: email.toLowerCase(),
      username: email.split('@')[0],
      password: hashedPassword,
      role: finalRole,
      branch: branch || null,
      semester: semester || null,
    });

    // Delete verified OTP record
    await OTP.deleteOne({ email: email.toLowerCase() });

    const userObj = newUser.toObject();
    const roleToAssign = userObj.email.toLowerCase() === adminEmail ? 'admin' : newUser.role;
    userObj.role = roleToAssign;

    const token = jwt.sign(
      { id: newUser._id.toString(), email: newUser.email, role: roleToAssign },
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

    return NextResponse.json({ user: userObj });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
