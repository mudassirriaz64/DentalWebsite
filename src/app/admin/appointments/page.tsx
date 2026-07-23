import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getServices } from '@/data/services';
import { getDoctors } from '@/data/doctors';
import AppointmentsAdminContent from '@/components/sections/admin/AppointmentsAdminContent';

export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const [services, doctors] = await Promise.all([getServices(), getDoctors()]);

  return <AppointmentsAdminContent services={services} doctors={doctors} />;
}
