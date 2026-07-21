import type { Metadata } from 'next';
import React from 'react';
import TeamHero from '@/components/sections/team/TeamHero';
import DoctorsGrid from '@/components/sections/team/DoctorsGrid';
import Workflow from '@/components/sections/team/Workflow';
import TeamFAQ from '@/components/sections/team/TeamFAQ';
import ConsultationCTA from '@/components/sections/team/ConsultationCTA';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the multidisciplinary dental and surgical specialists at Dental Cosmetics & Implant Centre.',
};

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <DoctorsGrid />
      <Workflow />
      <TeamFAQ />
      <ConsultationCTA />
    </>
  );
}
