import type { Metadata } from 'next';
import React from 'react';
import ServicesHero from '@/components/sections/services/ServicesHero';
import ServicesGrid from '@/components/sections/services/ServicesGrid';
import ServicesCTA from '@/components/sections/services/ServicesCTA';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Discover our specialized dental solutions. We offer cosmetic makeovers, dental implants, Invisalign, and priority emergency dental care.',
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <ServicesCTA />
    </>
  );
}
