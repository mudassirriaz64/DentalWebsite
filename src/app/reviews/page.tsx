import type { Metadata } from 'next';
import React from 'react';
import ReviewsPageContent from '@/components/sections/reviews/ReviewsPageContent';
import { getApprovedReviews, getReviewStats } from '@/lib/reviews';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Patient Reviews - Dental Cosmetics & Implant Centre',
  description:
    'Read real verified transformations, patient stories, and dental implant testimonials. Submit your own reviews.',
};

export default async function ReviewsPage() {
  const [initialReviews, stats] = await Promise.all([
    getApprovedReviews({ page: 1, pageSize: 6 }),
    getReviewStats(),
  ]);

  return <ReviewsPageContent initialReviews={initialReviews} stats={stats} />;
}
