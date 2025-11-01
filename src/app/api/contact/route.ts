import { NextResponse } from 'next/server';
import * as z from 'zod';
import { prisma } from '@/lib/prisma';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = contactSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ errors: parsedData.error.flatten().fieldErrors }, { status: 400 });
    }

    await prisma.contactSubmission.create({
      data: parsedData.data,
    });

    return NextResponse.json({ message: 'Your message has been sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
