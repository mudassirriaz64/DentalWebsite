import { NextResponse } from 'next/server';
import { z } from 'zod';
import { submitAppointment } from '@/lib/appointments';

const appointmentSchema = z.object({
  patientName: z.string().min(1, 'Patient Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Valid phone number is required (min 7 digits)'),
  whatsapp: z.string().optional().nullable(),
  serviceId: z.string().min(1, 'Service selection is required'),
  doctorId: z.string().optional().nullable(),
  preferredDate: z.string().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = appointmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const appointment = await submitAppointment(result.data);
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('Submit appointment API error:', error);
    return NextResponse.json(
      { error: 'Failed to record appointment request. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
