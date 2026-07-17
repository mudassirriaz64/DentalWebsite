import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
      },
    });

    console.log('Stored contact submission in database:', submission);
    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Public contact API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
