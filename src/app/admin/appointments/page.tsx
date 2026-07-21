import React from 'react';
import { getServices } from '@/data/services';
import { getDoctors } from '@/data/doctors';
import AppointmentsAdminContent from '@/components/sections/admin/AppointmentsAdminContent';

export default async function AdminAppointmentsPage() {
  const [services, doctors] = await Promise.all([getServices(), getDoctors()]);

  return <AppointmentsAdminContent services={services} doctors={doctors} />;
}
