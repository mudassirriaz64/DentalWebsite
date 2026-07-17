import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getApprovedReviews, submitReview } from '@/lib/reviews';

const submitReviewSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  rating: z.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  title: z.string().min(3, 'Title must be at least 3 characters long').max(100),
  body: z.string().min(10, 'Review text must be at least 10 characters long').max(1000),
  category: z.enum(['Implants', 'Cosmetic', 'General Care'], {
    message: 'Please select a valid category',
  }),
  treatmentType: z.string().max(100).optional(),
  isVerifiedPatient: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '6', 10);

    const reviews = await getApprovedReviews({ category, page, pageSize });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('API GET reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = submitReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const review = await submitReview(result.data);
    return NextResponse.json({ success: true, id: review.id });
  } catch (error) {
    console.error('API POST submit review error:', error);
    return NextResponse.json({ error: 'Failed to submit review. Please try again.' }, { status: 500 });
  }
}
