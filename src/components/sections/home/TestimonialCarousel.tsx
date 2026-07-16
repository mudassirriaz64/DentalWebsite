'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { testimonials } from '@/data/testimonials';

const testimonialImages = [
  '/images/home/patient-avatar.png',
  '/images/home/doctor-sarah.png',
  '/images/home/doctor-elena.png',
];

export const TestimonialCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' as const },
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[index];
  const currentImage = testimonialImages[index] || testimonialImages[0];

  return (
    <section className="py-24 bg-white relative overflow-hidden flex flex-col justify-center items-center">
      {/* Decorative 800px Circle Behind Content */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5 pointer-events-none -z-10" />

      <Container className="max-w-4xl relative z-10 flex flex-col items-center text-center">
        {/* Header Eyebrow */}
        <div className="mb-10 flex flex-col items-center">
          <SectionHeading eyebrow="Testimonials" title="Stories of Transformed Lives" showDots={true} />
        </div>

        {/* Quotes Block */}
        <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center py-4 px-6 sm:px-12">
          {/* Quote Icon Background */}
          <div className="absolute top-0 text-accent/10 pointer-events-none -z-10 animate-pulse">
            <Quote className="w-20 h-20 rotate-180" />
          </div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentTestimonial.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center"
            >
              {/* Quote Text */}
              <blockquote className="font-serif font-medium text-lg sm:text-2xl lg:text-3xl text-primary leading-relaxed sm:leading-loose mb-10 max-w-3xl">
                "{currentTestimonial.text}"
              </blockquote>

              {/* Author Section */}
              <div className="flex flex-col items-center gap-4">
                {/* Profile Photo */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary-soft shadow-md bg-slate-100 shrink-0">
                  <Image
                    src={currentImage}
                    alt={currentTestimonial.author}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                {/* Author Info */}
                <div className="flex flex-col">
                  <cite className="not-italic font-serif font-bold text-lg text-dark-text">
                    {currentTestimonial.author}
                  </cite>
                  <span className="font-sans font-bold text-[11px] uppercase tracking-widest text-accent mt-1">
                    {currentTestimonial.role}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full border border-border/80 bg-white hover:bg-primary-light text-primary hover:border-primary-soft transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-350 cursor-pointer ${
                  i === index ? 'bg-accent w-6' : 'bg-primary-soft/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-3 rounded-full border border-border/80 bg-white hover:bg-primary-light text-primary hover:border-primary-soft transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Container>
    </section>
  );
};

export default TestimonialCarousel;
