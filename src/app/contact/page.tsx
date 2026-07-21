import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import ContactHero from '@/components/sections/contact/ContactHero';
import ContactGrid from '@/components/sections/contact/ContactGrid';
import CoreValues from '@/components/sections/contact/CoreValues';
import { getClinicSettings } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Contact Us - Dental Cosmetics & Implant Centre',
  description:
    'Book a free consultation query. Review clinic directions, map locations, and weekly opening hours schedules.',
};

export default async function ContactPage() {
  const settings = await getClinicSettings();

  return (
    <>
      <ContactHero />
      <Suspense fallback={<div className="py-12 text-center text-xs text-slate-400">Loading form...</div>}>
        <ContactGrid settings={settings} />
      </Suspense>
      <CoreValues />
    </>
  );
}
