import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const appointmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  message: z.string().optional().nullable(),
  serviceId: z.string().min(1, 'Please select a service'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = appointmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;

    // Check if the service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!serviceExists) {
      return NextResponse.json({ error: 'Selected service does not exist' }, { status: 400 });
    }

    const parsedDate = new Date(data.preferredDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid preferred date' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: parsedDate,
        preferredTime: data.preferredTime,
        message: data.message || null,
        serviceId: data.serviceId,
      },
    });

    console.log('Stored appointment booking in database:', appointment);
    return NextResponse.json({ success: true, id: appointment.id });
  } catch (error) {
    console.error('Public appointment booking API error:', error);
    return NextResponse.json({ error: 'Failed to request appointment' }, { status: 500 });
  }
}
