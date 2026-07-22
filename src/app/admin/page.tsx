import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DashboardContent from '@/components/sections/admin/DashboardContent';
import AdminOverviewDashboard from '@/components/sections/admin/AdminOverviewDashboard';
import { prisma } from '@/lib/db';

export const metadata = {
  title: 'Admin Dashboard - Clinic Control Panel',
  description: 'Manage clinic services, doctors, testimonials, and review user submissions.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const resolvedParams = await searchParams;
  const username = (resolvedParams.username as string) || session.username;

  if (!resolvedParams.tab) {
    const [
      unreadAppointments,
      unreadSubmissions,
      pendingReviews,
      totalServices,
      totalDoctors,
      totalGallery,
    ] = await Promise.all([
      prisma.appointment.count({ where: { isRead: false } }),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.review.count({ where: { status: 'pending' } }),
      prisma.service.count(),
      prisma.doctor.count(),
      prisma.galleryItem.count(),
    ]);

    return (
      <AdminOverviewDashboard
        username={username}
        unreadAppointments={unreadAppointments}
        unreadSubmissions={unreadSubmissions}
        pendingReviews={pendingReviews}
        totalServices={totalServices}
        totalDoctors={totalDoctors}
        totalGallery={totalGallery}
      />
    );
  }

  return (
    <Suspense fallback={<div className="p-6 text-slate-500 font-sans">Loading panel workspace...</div>}>
      <DashboardContent username={username} />
    </Suspense>
  );
}
