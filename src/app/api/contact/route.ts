import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to MongoDB
    await connectToDatabase();
    const newMessage = await ContactMessage.create({ name, email, message });

    // --- EMAIL NOTIFICATION ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,   // your Gmail
        pass: process.env.CONTACT_PASS     // app password
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.CONTACT_EMAIL,       // your inbox
      subject: `New Contact Query from ${name}`,
      text: `From: ${name}\nEmail: ${email}\nMessage:\n${message}`
    });

    // --- SMS via Twilio ---
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    const toPhone = '+917889866214';

    if (accountSid && authToken && fromPhone) {
      try {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

        const smsText = `CampusNotes Contact Alert!\nFrom: ${name}\nEmail: ${email}\nMessage: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: fromPhone,
            To: toPhone,
            Body: smsText,
          }).toString(),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error('[Twilio SMS Error]', errData);
        } else {
          console.log('[Twilio SMS] Notification successfully sent to', toPhone);
        }
      } catch (smsError) {
        console.error('[SMS Delivery Exception]', smsError);
      }
    } else {
      console.warn('[SMS Skip] Twilio credentials not set in .env. Skipping SMS notification.');
    }

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
