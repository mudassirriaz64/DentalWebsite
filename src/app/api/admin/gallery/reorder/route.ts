import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int(),
    })
  ),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = reorderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { items } = result.data;

    // Execute batch update inside a Prisma Transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.galleryItem.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Batch reorder error:', error);
    return NextResponse.json({ error: 'Failed to save sorting changes' }, { status: 500 });
  }
}
