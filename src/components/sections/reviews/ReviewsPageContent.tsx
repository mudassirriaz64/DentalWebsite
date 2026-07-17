'use client';

import React, { useState } from 'react';
import ReviewsHero from './ReviewsHero';
import StatsBar from './StatsBar';
import StoriesGrid from './StoriesGrid';
import BottomCTA from './BottomCTA';
import ReviewSubmitModal from './ReviewSubmitModal';
import { Review, SiteStat } from '@/types/reviews';

interface ReviewsPageContentProps {
  initialReviews: Review[];
  stats: SiteStat[];
}

export const ReviewsPageContent: React.FC<ReviewsPageContentProps> = ({ initialReviews, stats }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ReviewsHero onOpenModal={() => setIsModalOpen(true)} />
      <StatsBar stats={stats} />
      <StoriesGrid initialReviews={initialReviews} onOpenModal={() => setIsModalOpen(true)} />
      <BottomCTA />
      <ReviewSubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ReviewsPageContent;
