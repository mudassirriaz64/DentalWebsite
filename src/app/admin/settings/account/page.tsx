import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AccountSettingsContent from '@/components/sections/admin/AccountSettingsContent';

export const dynamic = 'force-dynamic';

export default async function AdminAccountSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return <AccountSettingsContent />;
}
