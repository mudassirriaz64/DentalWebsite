import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { getServices } from '@/data/services';
import { getBookableDoctors } from '@/lib/appointments';
import BookingFormClient from '@/components/sections/booking/BookingFormClient';

export const metadata: Metadata = {
  title: 'Book Appointment - Dental Cosmetics & Implant Centre',
  description:
    'Schedule your dental appointment or cosmetic consultation online. Select your service, preferred doctor, and timing preference.',
};

export default async function BookAppointmentPage() {
  const [services, doctors] = await Promise.all([getServices(), getBookableDoctors()]);

  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-slate-400">Loading booking form...</div>}>
      <BookingFormClient services={services} doctors={doctors} />
    </Suspense>
  );
}
