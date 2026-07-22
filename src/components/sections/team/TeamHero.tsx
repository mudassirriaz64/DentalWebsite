'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import HighlightText from './HighlightText';
import { resolveImageUrl } from '@/lib/media';

interface SpotlightData {
  name: string;
  title: string;
  imagePath: string;
}

const fallback: SpotlightData = {
  name: 'Dr. Sarah Jane',
  title: 'Chief Cosmetic Specialist',
  imagePath: '/images/home/hero-dentist.png',
};

export const TeamHero: React.FC = () => {
  const [spotlight, setSpotlight] = useState<SpotlightData>(fallback);

  useEffect(() => {
    fetch('/api/founder-spotlight')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) setSpotlight(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative pt-36 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-bg flex flex-col justify-center items-center text-center">
      <Container className="flex flex-col items-center">
        {/* Mint Pill Badge */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-hero-badge-bg-mint text-hero-badge-text-dark font-sans font-bold text-xs uppercase tracking-wider mb-6 shadow-sm"
        >
          World-Class Care
        </motion.span>

        {/* H1 Heading - Dark Navy #121C2C with swoosh under 'Doctors' */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="font-serif font-bold text-4xl sm:text-5xl lg:text-[48px] lg:leading-[58px] text-hero-heading-dark tracking-[-0.96px] mb-6 max-w-2xl"
        >
          Our <HighlightText>Doctors</HighlightText>
        </motion.h1>

        {/* Centered Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="text-base sm:text-lg text-body-text leading-[29px] font-sans font-normal mb-12 max-w-2xl"
        >
          Meet the exceptional team of multi-disciplinary clinical specialists committed to precision dentistry, aesthetic mastery, and patient comfort.
        </motion.p>

        {/* Large Featured Image below (848x400) with overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="w-full max-w-4xl rounded-[24px] overflow-hidden shadow-card border border-slate-100 aspect-[848/400] relative bg-slate-100 group"
        >
          <Image
            src={resolveImageUrl(spotlight.imagePath, '/images/home/hero-dentist.png')}
            alt={spotlight.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 848px"
            className="object-cover group-hover:scale-101 transition-transform duration-700"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent z-10" />

          {/* Bottom-Left Caption */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20 text-left">
            <h3 className="font-serif font-bold text-lg md:text-xl text-white leading-tight">
              {spotlight.name}
            </h3>
            <p className="text-xs md:text-sm text-body-text-dark/95 font-sans font-normal mt-1">
              {spotlight.title}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default TeamHero;
