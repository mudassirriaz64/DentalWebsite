import React from 'react';
import Hero from '@/components/sections/home/Hero';
import Philosophy from '@/components/sections/home/Philosophy';
import HomeServicesCarousel from '@/components/sections/home/HomeServicesCarousel';
import StatsBar from '@/components/sections/home/StatsBar';
import TestimonialCarousel from '@/components/sections/home/TestimonialCarousel';
import FinalCTA from '@/components/sections/home/FinalCTA';
import { getApprovedReviews, getSiteStats, getApprovedReviewsCount } from '@/lib/reviews';
import { getServices } from '@/data/services';
import { getClinicSettings } from '@/lib/contact';
import { Testimonial, Service } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let mappedTestimonials: Testimonial[] = [];
  let initialServices: Service[] = [];
  let settings = null;
  let homeStats: any[] = [];
  let liveReviewsCount = 0;

  try {
    settings = await getClinicSettings();
    homeStats = await getSiteStats('home');
    liveReviewsCount = await getApprovedReviewsCount();
  } catch (error) {
    console.warn('Failed to load clinic settings/stats for home:', error);
  }

  try {
    const dbReviews = await getApprovedReviews({ page: 1, pageSize: 6, featured: true });
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

  // Find Smiles Transformed / Patient trust stat for Hero
  const patientStat = homeStats.find(
    (s) => s.label.toLowerCase().includes('smile') || s.label.toLowerCase().includes('patient')
  );

  // Filter out duplicate reviews stats from database stats, append dynamic live reviews count
  const filteredHomeStats = homeStats.filter(
    (s) => !s.label.toLowerCase().includes('review')
  );
  const statsList = [
    ...filteredHomeStats,
    {
      id: 'live-reviews-stat',
      value: `${liveReviewsCount || 50}+`,
      label: 'Five Star Reviews',
      page: 'home',
      displayOrder: 99,
    },
  ];

  return (
    <>
      <Hero settings={settings} patientStat={patientStat} liveReviewsCount={liveReviewsCount} />
      <Philosophy />
      <HomeServicesCarousel initialServices={initialServices.length > 0 ? initialServices : undefined} />
      <StatsBar stats={statsList} />
      <TestimonialCarousel initialTestimonials={mappedTestimonials.length > 0 ? mappedTestimonials : undefined} />
      <FinalCTA />
    </>
  );
}
