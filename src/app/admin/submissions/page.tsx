import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAllSubmissions } from '@/lib/admin/submissions';
import SubmissionsAdminContent from '@/components/sections/admin/SubmissionsAdminContent';

export const dynamic = 'force-dynamic';

export default async function AdminSubmissionsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const submissions = await getAllSubmissions();

  // Serialize Date objects to ISO strings for safe client-side props transfer
  const formattedSubmissions = submissions.map((sub) => ({
    ...sub,
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
  }));

  return <SubmissionsAdminContent initialSubmissions={formattedSubmissions} />;
}
