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

  const stats = await getStatsForAdmin();

  // Format Dates for safe prop transfer
  const formattedStats = stats.map((s) => ({
    ...s,
    updatedAt: s.updatedAt.toISOString(),
  }));

  return <StatsAdminContent initialStats={formattedStats} />;
}
