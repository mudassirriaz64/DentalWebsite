'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export const ServicesHero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-bg flex flex-col justify-center items-center text-center">
      {/* Faint Overlapping Decorative Outline Squares (Teal & Crimson, 10% Opacity) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none -z-10 translate-x-12 -translate-y-12 select-none opacity-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Teal Square */}
          <rect x="10" y="10" width="70" height="70" rx="4" stroke="var(--color-primary)" strokeWidth="1.5" />
          {/* Crimson Square */}
          <rect x="25" y="25" width="70" height="70" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" />
        </svg>
      </div>

      <Container className="max-w-[768px] flex flex-col items-center">
        {/* Eyebrow Label: crimson, uppercase, bold, letter-spacing 1.4px */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-sans font-bold text-xs uppercase tracking-[1.4px] text-accent mb-4 block"
        >
          Our Services
        </motion.span>

        {/* H1 Title: serif, 48px, centered, teal */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="font-serif font-bold text-4xl sm:text-5xl lg:text-[48px] lg:leading-[58px] text-primary tracking-[-0.96px] mb-6"
        >
          Transforming Smiles with Bespoke Advanced Dentistry
        </motion.h1>

        {/* Subtext: centered paragraph, gray, 18px */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="text-base sm:text-lg text-body-text leading-[29px] font-sans font-normal mb-10 max-w-2xl"
        >
          We offer a comprehensive suite of dental solutions combining bio-compatible precision, cosmetic artistry, and anxiety-free patient care.
        </motion.p>

        {/* Two CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto font-sans"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 bg-primary text-white hover:bg-primary-hover btn-diagonal-stripe shadow-lg cursor-pointer"
          >
            Book Consultation
          </Link>
          <a
            href="#services-list"
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent cursor-pointer"
          >
            Explore Services
          </a>
        </motion.div>
      </Container>
    </section>
  );
};

export default ServicesHero;
