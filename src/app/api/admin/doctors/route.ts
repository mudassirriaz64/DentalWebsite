import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const doctorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  imagePath: z.string().min(1, 'Image path is required'),
  specialties: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const parsedDoctors = doctors.map((d) => ({
      ...d,
      specialties: JSON.parse(d.specialtiesJson || '[]'),
      education: JSON.parse(d.educationJson || '[]'),
    }));
    return NextResponse.json(parsedDoctors);
  } catch (error) {
    console.error('Fetch doctors error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = doctorSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;
    const specialtiesJson = JSON.stringify(data.specialties || []);
    const educationJson = JSON.stringify(data.education || []);

    const newDoctor = await prisma.doctor.create({
      data: {
        name: data.name,
        role: data.role,
        title: data.title,
        bio: data.bio,
        imagePath: data.imagePath,
        specialtiesJson,
        educationJson,
      },
    });

    return NextResponse.json({
      ...newDoctor,
      specialties: data.specialties || [],
      education: data.education || [],
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
