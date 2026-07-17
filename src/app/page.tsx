import React from 'react';
import Hero from '@/components/sections/home/Hero';
import Philosophy from '@/components/sections/home/Philosophy';
import ServicesBento from '@/components/sections/home/ServicesBento';
import StatsBar from '@/components/sections/home/StatsBar';
import TestimonialCarousel from '@/components/sections/home/TestimonialCarousel';
import FinalCTA from '@/components/sections/home/FinalCTA';
import { getApprovedReviews } from '@/lib/reviews';
import { Testimonial } from '@/types';

export default async function Home() {
  let mappedTestimonials: Testimonial[] = [];
  try {
    const dbReviews = await getApprovedReviews({ page: 1, pageSize: 6 });
    mappedTestimonials = dbReviews.map((r) => ({
      id:     r.id,
      author: r.patientName,
      role:   r.treatmentType ?? r.category,
      rating: r.rating,
      text:   r.body,
      date:   r.createdAt,
    }));
  } catch (error) {
    console.warn('Database query failed for reviews on homepage:', error);
  }

  return (
    <>
      <Hero />
      <Philosophy />
      <ServicesBento />
      <StatsBar />
      <TestimonialCarousel initialTestimonials={mappedTestimonials.length > 0 ? mappedTestimonials : undefined} />
      <FinalCTA />
    </>
  );
}
