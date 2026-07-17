import React from 'react';
import Hero from '@/components/sections/home/Hero';
import Philosophy from '@/components/sections/home/Philosophy';
import ServicesBento from '@/components/sections/home/ServicesBento';
import StatsBar from '@/components/sections/home/StatsBar';
import TestimonialCarousel from '@/components/sections/home/TestimonialCarousel';
import FinalCTA from '@/components/sections/home/FinalCTA';

import prisma from '@/lib/prisma';

export default async function Home() {
  let dbReviews: any[] = [];
  try {
    dbReviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.warn('Database query failed for reviews on homepage:', error);
  }

  return (
    <>
      <Hero />
      <Philosophy />
      <ServicesBento />
      <StatsBar />
      <TestimonialCarousel initialTestimonials={dbReviews.length > 0 ? dbReviews : undefined} />
      <FinalCTA />
    </>
  );
}
