import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const doctorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  imagePath: z.string().min(1, 'Image path is required'),
  specialties: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
});

type Params = Promise<{ id: string }>;

export async function PATCH(request: Request, segmentData: { params: Params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await segmentData.params;

  try {
    const body = await request.json();
    const result = doctorSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;
    const specialtiesJson = JSON.stringify(data.specialties || []);
    const educationJson = JSON.stringify(data.education || []);

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        name: data.name,
        title: data.title,
        bio: data.bio,
        imagePath: data.imagePath,
        specialtiesJson,
        educationJson,
        displayOrder: data.displayOrder ?? 0,
      },
    });

    return NextResponse.json({
      ...updatedDoctor,
      specialties: data.specialties || [],
      education: data.education || [],
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function DELETE(request: Request, segmentData: { params: Params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await segmentData.params;

  try {
    await prisma.doctor.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete doctor error:', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
