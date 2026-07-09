import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Visitor from '@/lib/models/Visitor';

export async function GET() {
  try {
    await connectToDatabase();
    
    let visitor = await Visitor.findOne({ counterId: 'global' });
    if (!visitor) {
      visitor = await Visitor.create({ counterId: 'global', count: 0 });
    }
    
    return NextResponse.json({ count: visitor.count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    await connectToDatabase();
    
    const visitor = await Visitor.findOneAndUpdate(
      { counterId: 'global' },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    return NextResponse.json({ count: visitor.count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
