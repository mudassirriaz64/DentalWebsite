import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DashboardContent from '@/components/sections/admin/DashboardContent';

export const metadata = {
  title: 'Admin Dashboard - Clinic Control Panel',
  description: 'Manage clinic services, doctors, testimonials, and review user submissions.',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const resolvedParams = await searchParams;
  if (!resolvedParams.tab) {
    redirect('/admin/submissions');
  }

  return (
    <Suspense fallback={<div className="p-6 text-slate-500 font-sans">Loading panel workspace...</div>}>
      <DashboardContent username={resolvedParams.username as string || session.username} />
    </Suspense>
  );
}
