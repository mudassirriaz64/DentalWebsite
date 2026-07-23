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
import { SiteStat } from '@/types/reviews';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fire all 5 independent queries in parallel instead of sequentially
  const [settingsResult, statsResult, countResult, reviewsResult, servicesResult] =
    await Promise.allSettled([
      getClinicSettings(),
      getSiteStats('home'),
      getApprovedReviewsCount(),
      getApprovedReviews({ page: 1, pageSize: 6, featured: true }),
      getServices(),
    ]);

  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;
  const homeStats: SiteStat[] = statsResult.status === 'fulfilled' ? statsResult.value : [];
  const liveReviewsCount = countResult.status === 'fulfilled' ? countResult.value : 0;

  const mappedTestimonials: Testimonial[] =
    reviewsResult.status === 'fulfilled'
      ? reviewsResult.value.map((r) => ({
          id: r.id,
          author: r.patientName,
          role: r.treatmentType ?? r.category,
          rating: r.rating,
          text: r.body,
          date: r.createdAt,
        }))
      : [];

  const initialServices: Service[] =
    servicesResult.status === 'fulfilled' ? servicesResult.value : [];

  // Find Smiles Transformed / Patient trust stat for Hero
  const patientStat = homeStats.find(
    (s) => s.label.toLowerCase().includes('smile') || s.label.toLowerCase().includes('patient')
  );

  // Filter out duplicate reviews stats from database stats, append dynamic live reviews count
  const filteredHomeStats = homeStats.filter(
    (s) => !s.label.toLowerCase().includes('review')
  );
  const statsList: SiteStat[] = [
    ...filteredHomeStats,
    {
      id: 'live-reviews-stat',
      value: `${liveReviewsCount || 50}+`,
      label: 'Five Star Reviews',
      page: 'home',
      displayOrder: 99,
      updatedAt: new Date().toISOString(),
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
