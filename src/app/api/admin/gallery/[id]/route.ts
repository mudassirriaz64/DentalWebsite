import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const imageSchema = z.object({
  publicId: z.string().min(1, 'Image asset is required'),
  url: z.string().min(1, 'Image URL is required'),
  altText: z.string().min(10, 'Alt text must be at least 10 characters long'),
});

const galleryItemSchema = z.object({
  variant: z.enum(['comparison', 'vertical', 'square', 'wideSplit', 'small']),
  title: z.string().min(1, 'Title is required').max(60, 'Title cannot exceed 60 characters'),
  description: z.string().min(1, 'Description is required').max(160, 'Description cannot exceed 160 characters'),
  category: z.string().min(1, 'Category is required'),
  images: z.object({
    before: imageSchema.optional(),
    after: imageSchema.optional(),
    main: imageSchema.optional(),
  }),
  tags: z.array(z.string()).optional(),
  isVerifiedPatient: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['published', 'draft']),
  displayOrder: z.number().int().optional(),
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
    const result = galleryItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;

    // Enforce required images based on status and variant
    if (data.status === 'published') {
      if (data.variant === 'comparison') {
        if (!data.images.before || !data.images.after) {
          return NextResponse.json(
            { error: 'Both Before and After images are required to publish a comparison case.' },
            { status: 400 }
          );
        }
      } else {
        if (!data.images.main) {
          return NextResponse.json(
            { error: 'A Main image is required to publish this case.' },
            { status: 400 }
          );
        }
      }
    }

    const updatedItem = await prisma.galleryItem.update({
      where: { id },
      data: {
        variant: data.variant,
        title: data.title,
        description: data.description,
        category: data.category,
        beforeImageId: data.images.before?.publicId || null,
        beforeImageUrl: data.images.before?.url || null,
        beforeImageAlt: data.images.before?.altText || null,
        afterImageId: data.images.after?.publicId || null,
        afterImageUrl: data.images.after?.url || null,
        afterImageAlt: data.images.after?.altText || null,
        mainImageId: data.images.main?.publicId || null,
        mainImageUrl: data.images.main?.url || null,
        mainImageAlt: data.images.main?.altText || null,
        tags: JSON.stringify(data.tags || []),
        isVerifiedPatient: !!data.isVerifiedPatient,
        featured: !!data.featured,
        status: data.status,
        displayOrder: data.displayOrder,
      },
    });

    return NextResponse.json({
      ...updatedItem,
      images: data.images,
      tags: data.tags || [],
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    return NextResponse.json({ error: 'Failed to update gallery case' }, { status: 500 });
  }
}

export async function DELETE(request: Request, segmentData: { params: Params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await segmentData.params;

  try {
    await prisma.galleryItem.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery case' }, { status: 500 });
  }
}
