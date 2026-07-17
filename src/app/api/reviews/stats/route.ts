import { NextResponse } from 'next/server';
import { getReviewStats } from '@/lib/reviews';

export async function GET() {
  try {
    const stats = await getReviewStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API GET stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch review statistics' }, { status: 500 });
  }
}
