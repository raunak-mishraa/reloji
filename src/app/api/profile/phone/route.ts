import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, userId } = body;

    if (!phone || !userId) {
      return NextResponse.json({ message: 'Missing phone number or user ID' }, { status: 400 });
    }

    const trimmed = String(phone).trim();
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(trimmed)) {
      return NextResponse.json({ message: 'Invalid phone number format' }, { status: 400 });
    }

    try {
      await prisma.profile.upsert({
        where: { userId: userId },
        update: { phone: trimmed },
        create: { userId: userId, phone: trimmed },
      });
    } catch (err: any) {
      // Handle unique constraint violation (P2002)
      if (err?.code === 'P2002' || err?.message?.includes('Unique constraint')) {
        return NextResponse.json({ message: 'Phone number is already in use' }, { status: 409 });
      }
      throw err;
    }

    return NextResponse.json({ message: 'Phone number updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
