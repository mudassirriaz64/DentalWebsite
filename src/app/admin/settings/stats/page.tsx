import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getStatsForAdmin } from '@/lib/admin/stats';
import StatsAdminContent from '@/components/sections/admin/StatsAdminContent';

export const dynamic = 'force-dynamic';

export default async function AdminStatsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const reviewsStats = await getStatsForAdmin('reviews');
  const homeStats = await getStatsForAdmin('home');

  const formatStats = (items: any[]) =>
    items.map((s) => ({
      ...s,
      updatedAt: s.updatedAt.toISOString(),
    }));

  return (
    <StatsAdminContent
      initialReviewsStats={formatStats(reviewsStats)}
      initialHomeStats={formatStats(homeStats)}
    />
  );
}
