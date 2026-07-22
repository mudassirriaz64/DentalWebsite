'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Plus, MessageSquarePlus, AlertCircle, Loader } from 'lucide-react';
import { Review } from '@/types/reviews';

interface StoriesGridProps {
  initialReviews: Review[];
  onOpenModal: () => void;
}

export const StoriesGrid: React.FC<StoriesGridProps> = ({ initialReviews, onOpenModal }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeCategory, setActiveCategory] = useState('All Reviews');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialReviews.length >= 6);

  const categories = ['All Reviews', 'Implants', 'Cosmetic', 'General Care'];

  // Reset page and reviews when activeCategory changes
  useEffect(() => {
    if (page === 1 && activeCategory === 'All Reviews') {
      setReviews(initialReviews);
      setHasMore(initialReviews.length >= 6);
      return;
    }

    const fetchInitialCategoryReviews = async () => {
      setLoading(true);
      try {
        const catParam = activeCategory === 'All Reviews' ? '' : `&category=${activeCategory}`;
        const res = await fetch(`/api/reviews?page=1&pageSize=6${catParam}`);
        const data = await res.json();
        
        setReviews(data);
        setPage(1);
        setHasMore(data.length >= 6);
      } catch (err) {
        console.error('Error fetching filtered reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCategoryReviews();
  }, [activeCategory]);

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    const nextPage = page + 1;

    try {
      const catParam = activeCategory === 'All Reviews' ? '' : `&category=${activeCategory}`;
      const res = await fetch(`/api/reviews?page=${nextPage}&pageSize=6${catParam}`);
      const data = await res.json();

      if (data.length > 0) {
        setReviews([...reviews, ...data]);
        setPage(nextPage);
        setHasMore(data.length >= 6);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 30) return `${diffDays} days ago`;
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    } catch {
      return '';
    }
  };

  // Render review stars helper
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < rating ? 'text-[#FFB020] fill-[#FFB020]' : 'text-slate-200'
        }`}
      />
    ));
  };

  // Animation layout configs
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 20, stiffness: 100 },
    },
  };

  return (
    <section className="py-20 md:py-24 bg-bg overflow-hidden font-sans text-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Heading + Filter Pill Header */}
        <header className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end mb-12">
          <div className="text-left max-w-lg">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">
              Patient Stories
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-primary leading-tight">
              Real Patients, Real Transformations
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-[#F0F0F0] text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Stories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
        >
          {reviews.map((rev, index) => {
            const relativeTime = getRelativeTime(rev.createdAt);

            // Featured Card Renders in Pink highlighted style
            if (rev.featured) {
              return (
                <motion.div
                  key={rev.id}
                  variants={cardVariants}
                  className="lg:col-span-2 bg-[#F8F8F8] border border-[#D8D8D8] rounded-3xl p-8 shadow-sm flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Testimonial glowing blur */}
                  <div className="absolute top-[-50px] right-[-50px] w-36 h-36 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

                  <div className="flex flex-col gap-4">
                    {/* Rating stars & Time age */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {renderStars(rev.rating)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {relativeTime}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-serif font-extrabold text-xl md:text-2xl text-accent leading-tight">
                      "{rev.title}"
                    </h3>

                    {/* Testimony text body */}
                    <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed leading-6 whitespace-pre-line">
                      {rev.body}
                    </p>
                  </div>

                  {/* Patient Info row */}
                  <div className="flex items-center justify-between mt-8 border-t border-[#C0C0C0] pt-4">
                    <div className="flex items-center gap-3">
                      {rev.patientAvatarUrl ? (
                        <img
                          src={rev.patientAvatarUrl}
                          alt={rev.patientName}
                          className="w-10 h-10 rounded-full object-cover shadow-inner"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                          {rev.patientName.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-primary text-sm">
                          {rev.patientName}
                        </span>
                        {rev.treatmentType && (
                          <span className="text-[10px] text-slate-500 font-semibold font-sans mt-0.5">
                            {rev.treatmentType}
                          </span>
                        )}
                      </div>
                    </div>

                    {rev.isVerifiedPatient && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-accent uppercase tracking-wider bg-white/70 border border-[#D8D8D8] px-2.5 py-1 rounded-full shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Verified Patient
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            }

            // Standard Card Renders
            return (
              <React.Fragment key={rev.id}>
                {/* Insert the static CTA prompt card at index 2 (third slot) */}
                {index === 2 && (
                  <motion.div
                    variants={cardVariants}
                    className="bg-[#0B5E2F] text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-card transition-all duration-300 relative overflow-hidden border border-[#004020]"
                  >
                    <div className="absolute top-[-50px] right-[-50px] w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />

                    <div className="flex flex-col gap-3">
                      <div className="bg-white/10 p-3 rounded-2xl w-fit mb-2 flex items-center justify-center">
                        <MessageSquarePlus className="w-5 h-5 text-primary-light" />
                      </div>
                      <h3 className="font-serif font-bold text-xl text-[#7AC943]">
                        Ready to share your story?
                      </h3>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        Your experience helps others make informed choices. Tell us about your treatment journey.
                      </p>
                    </div>

                    <button
                      onClick={onOpenModal}
                      className="w-full inline-flex items-center justify-center gap-1 px-5 py-3 rounded-full bg-white hover:bg-slate-100 text-primary hover:scale-102 font-sans font-bold text-xs shadow-md transition-all cursor-pointer mt-8"
                    >
                      Leave a Review <Plus className="w-3.5 h-3.5 text-primary" />
                    </button>
                  </motion.div>
                )}

                <motion.div
                  variants={cardVariants}
                  className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col gap-4">
                    {/* Rating & Relative Time */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {renderStars(rev.rating)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {relativeTime}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-serif font-bold text-lg text-primary leading-tight">
                      "{rev.title}"
                    </h3>

                    {/* Body text */}
                    <p className="text-xs md:text-sm text-body-text leading-relaxed font-normal line-clamp-5">
                      {rev.body}
                    </p>
                  </div>

                  {/* Patient Row */}
                  <div className="flex items-center justify-between mt-8 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3">
                      {rev.patientAvatarUrl ? (
                        <img
                          src={rev.patientAvatarUrl}
                          alt={rev.patientName}
                          className="w-10 h-10 rounded-full object-cover shadow-inner"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm shadow-inner">
                          {rev.patientName.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-primary text-sm">
                          {rev.patientName}
                        </span>
                        {rev.treatmentType && (
                          <span className="text-[10px] text-slate-400 font-semibold font-sans mt-0.5">
                            {rev.treatmentType}
                          </span>
                        )}
                      </div>
                    </div>

                    {rev.isVerifiedPatient && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-wider bg-primary-light/40 px-2.5 py-1 rounded-full shadow-inner">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified
                      </span>
                    )}
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {reviews.length === 0 && !loading && (
          <div className="py-12 bg-slate-50 rounded-3xl text-center text-slate-400 font-semibold border flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-300" /> No reviews found in this category.
          </div>
        )}

        {/* Load More Trigger Button */}
        {hasMore && (
          <div className="flex justify-center mt-12 select-none">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white font-sans font-bold text-xs transition-all shadow-sm cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Loading Stories...
                </>
              ) : (
                'Load More Stories'
              )}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default StoriesGrid;
