import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  slug: z.string().min(1, 'Slug is required'),
  iconName: z.string().min(1, 'Icon name is required'),
  imagePath: z.string().nullable().optional(),
  variant: z.string().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  bullets: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
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
    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;
    const bulletsJson = JSON.stringify(data.bullets || []);

    // Resolve slug collisions automatically (excluding current item)
    let baseSlug = data.slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
    if (!baseSlug) {
      baseSlug = data.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
    }

    let resolvedSlug = baseSlug;
    let isUnique = false;
    let suffix = 0;

    while (!isUnique) {
      const existing = await prisma.service.findFirst({
        where: {
          slug: resolvedSlug,
          NOT: { id }
        }
      });
      if (!existing) {
        isUnique = true;
      } else {
        suffix++;
        resolvedSlug = `${baseSlug}-${suffix}`;
      }
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        slug: resolvedSlug,
        iconName: data.iconName,
        imagePath: data.imagePath || null,
        variant: data.variant || null,
        ctaLabel: data.ctaLabel || null,
        bulletsJson,
        featured: data.featured ?? false,
      },
    });

    return NextResponse.json({
      ...updatedService,
      bullets: data.bullets || [],
    });
  } catch (error: any) {
    console.error('Update service error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A service with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: Request, segmentData: { params: Params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await segmentData.params;

  try {
    await prisma.service.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
