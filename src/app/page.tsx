import React from 'react';
import Hero from '@/components/sections/home/Hero';
import Philosophy from '@/components/sections/home/Philosophy';
import HomeServicesCarousel from '@/components/sections/home/HomeServicesCarousel';
import StatsBar from '@/components/sections/home/StatsBar';
import TestimonialCarousel from '@/components/sections/home/TestimonialCarousel';
import FinalCTA from '@/components/sections/home/FinalCTA';
import { getApprovedReviews } from '@/lib/reviews';
import { getServices } from '@/data/services';
import { Testimonial, Service } from '@/types';

export default async function Home() {
  let mappedTestimonials: Testimonial[] = [];
  let initialServices: Service[] = [];

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

  try {
    initialServices = await getServices();
  } catch (error) {
    console.warn('Database query failed for services on homepage:', error);
  }

  return (
    <>
      <Hero />
      <Philosophy />
      <HomeServicesCarousel initialServices={initialServices.length > 0 ? initialServices : undefined} />
      <StatsBar />
      <TestimonialCarousel initialTestimonials={mappedTestimonials.length > 0 ? mappedTestimonials : undefined} />
      <FinalCTA />
    </>
  );
}
