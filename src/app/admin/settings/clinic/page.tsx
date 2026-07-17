import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getClinicSettingsForAdmin } from '@/lib/admin/settings';
import SettingsAdminContent from '@/components/sections/admin/SettingsAdminContent';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const settings = await getClinicSettingsForAdmin();

  if (!settings) {
    return (
      <div className="p-12 text-slate-500 font-sans text-center">
        Settings not initialized. Please run `npx prisma db seed` to initialize.
      </div>
    );
  }

  // Format Dates for safe Client Component transfer
  const formattedSettings = {
    ...settings,
    updatedAt: settings.updatedAt.toISOString(),
  };

  return <SettingsAdminContent initialSettings={formattedSettings} />;
}
