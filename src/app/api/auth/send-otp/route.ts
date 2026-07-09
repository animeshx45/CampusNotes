import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save or update OTP in database
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    console.log(`[Verification OTP] Generated for ${email}: ${otp}`);

    // Set up nodemailer transport
    const mailHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const mailPort = parseInt(process.env.SMTP_PORT || '587');
    const mailUser = process.env.EMAIL_USER;
    const mailPass = process.env.EMAIL_PASS;

    if (mailUser && mailPass) {
      const transporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: mailPort === 465,
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      });

      await transporter.sendMail({
        from: `"CampusNotes" <${mailUser}>`,
        to: email.toLowerCase(),
        subject: 'Email Verification OTP - CampusNotes',
        text: `Your CampusNotes verification OTP code is ${otp}. It will expire in 5 minutes.`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center;">CampusNotes Verification</h2>
            <p>Welcome to CampusNotes! Please use the following One-Time Password (OTP) to verify your email address and complete registration:</p>
            <div style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 30px 0; color: #18181b;">
              ${otp}
            </div>
            <p style="font-size: 13px; color: #71717a; text-align: center;">This OTP is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
          </div>
        `,
      });
      console.log(`Verification email sent successfully to ${email}`);
    } else {
      console.warn('SMTP credentials not configured. OTP logged to console above.');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
