import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAllReviewsForAdmin } from '@/lib/admin/reviews';
import ReviewsAdminContent from '@/components/sections/admin/ReviewsAdminContent';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const reviews = await getAllReviewsForAdmin();

  // Convert Date properties to ISO strings for safe Client Component serialization
  const formattedReviews = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return <ReviewsAdminContent initialReviews={formattedReviews} />;
}
