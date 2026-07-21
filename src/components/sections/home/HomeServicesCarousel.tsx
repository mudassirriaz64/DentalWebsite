'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { Service } from '@/types';
import { services as staticServices } from '@/data/services';

interface HomeServicesCarouselProps {
  initialServices?: Service[];
}

export const HomeServicesCarousel: React.FC<HomeServicesCarouselProps> = ({
  initialServices,
}) => {
  const allServices = initialServices && initialServices.length > 0 ? initialServices : staticServices;

  // Requirement 1 & 8: Filter to ONLY featured services. If zero are marked featured, fall back to all services.
  const featuredServices = allServices.filter((s) => s.featured === true);
  const displayServices = featuredServices.length > 0 ? featuredServices : allServices;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  if (!displayServices || displayServices.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? displayServices.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === displayServices.length - 1 ? 0 : prev + 1));
  };

  const currentService = displayServices[currentIndex];

  // Default fallback image if service.imagePath is missing
  const cardImage = currentService.imagePath || '/images/home/dental-implants.png';

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: 'easeOut' as const,
      },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -60 : 60,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: 'easeIn' as const,
      },
    }),
  };

  return (
    <section className="py-20 md:py-24 bg-bg overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 w-full">
          <SectionHeading
            eyebrow="Our Services"
            title="Bespoke Treatments Designed for You"
            showDots={true}
            align="left"
            className="max-w-xl"
          />

          <div className="flex items-center gap-4 shrink-0">
            {/* View All Services Link */}
            <Link
              href="/services"
              className="text-sm font-bold text-accent hover:text-primary transition-colors flex items-center gap-1.5 group mr-2"
            >
              <span>View All Services</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous service"
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-primary shadow-sm flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next service"
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-primary shadow-sm flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Single Card Container */}
        <div className="relative w-full overflow-hidden min-h-[480px] md:min-h-[520px] rounded-[40px] shadow-card border border-slate-100 bg-slate-900">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentService.id || currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 select-none group"
            >
              {/* Full-bleed Background Image */}
              <Image
                src={cardImage}
                alt={currentService.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover group-hover:scale-102 transition-transform duration-700"
                priority
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent z-10 pointer-events-none" />

              {/* Top-left Featured Badge */}
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-accent text-white font-sans font-bold text-[10px] tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-sm">
                  Featured Service
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
                <div className="max-w-2xl text-left">
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-3 tracking-tight">
                    {currentService.title}
                  </h3>
                  <p className="text-sm md:text-base text-body-text-dark/90 leading-relaxed font-sans font-normal mb-5">
                    {currentService.shortDescription}
                  </p>

                  {/* Bullets: Rendered ONLY if the service has bullets */}
                  {currentService.bullets && currentService.bullets.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentService.bullets.map((bullet, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white/95 text-xs font-sans font-medium px-3.5 py-1.5 rounded-full border border-white/15"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {bullet}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Corner Link Button */}
                <Link
                  href={`/services#${currentService.slug}`}
                  aria-label={`Learn more about ${currentService.title}`}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform duration-300 shrink-0 cursor-pointer self-end md:self-auto"
                >
                  <ArrowUpRight className="w-6 h-6" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Counter & Dot Indicators */}
        <div className="flex items-center justify-between mt-6 px-2">
          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {displayServices.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-accent' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Slide Counter (e.g., "01 / 03") */}
          <div className="text-xs font-bold font-sans tracking-widest text-slate-500 uppercase">
            {String(currentIndex + 1).padStart(2, '0')} / {String(displayServices.length).padStart(2, '0')}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeServicesCarousel;
