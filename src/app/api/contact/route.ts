import { NextResponse } from 'next/server';
import { z } from 'zod';
import { submitContactForm } from '@/lib/contact';

const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters long').max(100),
  serviceInterest: z.string().min(1, 'Please select a service of interest'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters long'),
  whatsapp: z.string().min(7, 'WhatsApp number must be at least 7 characters long'),
  message: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const newSubmission = await submitContactForm(result.data);
    return NextResponse.json({ success: true, id: newSubmission.id });
  } catch (error) {
    console.error('API contact submit error:', error);
    return NextResponse.json({ error: 'Failed to submit query. Please try again.' }, { status: 500 });
  }
}
