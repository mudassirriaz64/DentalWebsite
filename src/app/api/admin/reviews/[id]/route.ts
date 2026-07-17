import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateReview, deleteReview } from '@/lib/admin/reviews';
import { getSession } from '@/lib/auth';

const reviewAdminSchema = z.object({
  patientName: z.string().min(2, 'Patient Name must be at least 2 characters long').max(100),
  patientAvatarUrl: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, 'Title is required').max(100),
  body: z.string().min(10, 'Review body text must be at least 10 characters').max(1000),
  category: z.enum(['Implants', 'Cosmetic', 'General Care']),
  treatmentType: z.string().nullable().optional(),
  isVerifiedPatient: z.boolean(),
  status: z.enum(['pending', 'approved', 'rejected']),
  featured: z.boolean(),
  displayOrder: z.number(),
});

// Zod schema for quick inline updates (PATCH status or featured)
const quickUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
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
    
    // Check if it is a quick update or a full edit update
    const isQuick = body.status !== undefined || body.featured !== undefined;

    if (isQuick) {
      const result = quickUpdateSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
      }

      // Read current review to keep details intact
      const { prisma } = await import('@/lib/db');
      const current = await prisma.review.findUnique({ where: { id } });
      if (!current) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }

      const updated = await prisma.review.update({
        where: { id },
        data: {
          status: result.data.status !== undefined ? result.data.status : current.status,
          featured: result.data.featured !== undefined ? result.data.featured : current.featured,
        },
      });

      return NextResponse.json(updated);
    } else {
      const result = reviewAdminSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
      }

      const updated = await updateReview(id, result.data);
      return NextResponse.json(updated);
    }
  } catch (error) {
    console.error('API PATCH admin review error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request, segmentData: { params: Params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await segmentData.params;

  try {
    await deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API DELETE admin review error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
