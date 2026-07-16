import React from 'react';
import Hero from '@/components/sections/home/Hero';
import Philosophy from '@/components/sections/home/Philosophy';
import ServicesBento from '@/components/sections/home/ServicesBento';
import StatsBar from '@/components/sections/home/StatsBar';
import TestimonialCarousel from '@/components/sections/home/TestimonialCarousel';
import FinalCTA from '@/components/sections/home/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Philosophy />
      <ServicesBento />
      <StatsBar />
      <TestimonialCarousel />
      <FinalCTA />
    </>
  );
}
