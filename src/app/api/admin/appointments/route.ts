import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const serviceId = searchParams.get('serviceId');
  const doctorId = searchParams.get('doctorId');
  const search = searchParams.get('search');

  try {
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }
    if (serviceId && serviceId !== 'all') {
      where.serviceId = serviceId;
    }
    if (doctorId && doctorId !== 'all') {
      where.doctorId = doctorId;
    }
    if (search && search.trim().length > 0) {
      const q = search.trim();
      where.OR = [
        { patientName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        service: true,
        doctor: true,
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Fetch admin appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
