import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const spotlightSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  imagePath: z.string().min(1, 'Image path is required'),
});

export async function GET() {
  try {
    const spotlight = await prisma.founderSpotlight.findFirst();
    return NextResponse.json(spotlight);
  } catch (error) {
    console.error('Fetch founder spotlight error:', error);
    return NextResponse.json({ error: 'Failed to fetch founder spotlight' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = spotlightSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.founderSpotlight.findFirst();
    if (!existing) {
      return NextResponse.json({ error: 'No spotlight record found' }, { status: 404 });
    }

    const updated = await prisma.founderSpotlight.update({
      where: { id: existing.id },
      data: result.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update founder spotlight error:', error);
    return NextResponse.json({ error: 'Failed to update founder spotlight' }, { status: 500 });
  }
}
