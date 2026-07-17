import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllReviewsForAdmin, createReview } from '@/lib/admin/reviews';
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
  displayOrder: z.number().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reviews = await getAllReviewsForAdmin();
    const formatted = reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API GET admin reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = reviewAdminSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const review = await createReview(result.data);
    return NextResponse.json(review);
  } catch (error) {
    console.error('API POST admin create review error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
