'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';

export const AboutHero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-bg">
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text Block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col items-start text-left"
        >
          {/* Badge */}
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-hero-badge-bg text-hero-badge-text font-sans font-bold text-xs uppercase tracking-wider mb-6 shadow-sm">
            Our Mission
          </span>

          {/* H1 Title */}
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-[48px] lg:leading-[58px] text-primary tracking-[-0.96px] mb-6">
            Excellence in <br />
            <span className="text-primary italic font-normal">Every Smile.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-body-text mb-8 max-w-[576px] leading-[29px] font-sans font-normal">
            We are dedicated to providing world-class cosmetic dentistry and advanced implant care
            in a boutique, patient-focused environment. We believe that clinical precision and
            aesthetic artistry must go hand-in-hand to achieve durable, beautiful smiles.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 w-full sm:w-auto mb-6 font-sans">
            <a
              href="#legacy-story"
              className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 bg-primary text-white hover:bg-primary-hover btn-diagonal-stripe shadow-lg cursor-pointer"
            >
              Discover Our Story
            </a>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent cursor-pointer"
            >
              View Success Gallery
            </Link>
          </div>
        </motion.div>

        {/* Right Column - Hero Image & Floating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="lg:col-span-6 relative flex justify-center lg:justify-end py-10"
        >
          {/* Hero Image Container Wrapper - border E7EEFF */}
          <div className="relative w-full max-w-[480px] aspect-square rounded-[24px] border-[12px] border-[#E7EEFF] shadow-card bg-slate-100 shrink-0">
            <Image
              src="/images/home/about-hero.png"
              alt="Dental Cosmetics Team"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              priority
              className="object-cover rounded-[10px]"
            />

            {/* Floating Stat Card overlapping bottom-left -24px offset */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
              className="absolute -bottom-6 -left-6 bg-stat-card-bg text-white px-6 py-5 rounded-[16px] shadow-lg flex flex-col items-start min-w-[210px] z-20 text-left"
            >
              <span className="font-serif font-bold text-4xl leading-none mb-1">25+</span>
              <span className="font-sans font-bold text-[11px] uppercase tracking-[1.4px] text-white/95 leading-tight">
                Years of Artistry
              </span>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default AboutHero;
