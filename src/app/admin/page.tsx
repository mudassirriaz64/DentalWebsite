import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DashboardContent from '@/components/sections/admin/DashboardContent';

export const metadata = {
  title: 'Admin Dashboard - Clinic Control Panel',
  description: 'Manage clinic services, doctors, testimonials, and review user submissions.',
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <Suspense fallback={<div className="p-6 text-slate-500 font-sans">Loading panel workspace...</div>}>
      <DashboardContent username={session.username} />
    </Suspense>
  );
}
