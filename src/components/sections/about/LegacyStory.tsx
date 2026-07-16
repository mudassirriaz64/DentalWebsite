'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { milestones } from '@/data/aboutData';

export const LegacyStory: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="legacy-story" className="py-20 md:py-24 bg-bg-alt overflow-hidden">
      <Container className="flex flex-col items-center">
        {/* Header Block */}
        <div className="text-center flex flex-col items-center mb-16">
          <SectionHeading
            eyebrow="Our History"
            title="A Legacy of Dedicated Care"
            showDots={false}
            subtitle="Follow our timeline of clinical dental innovations and cosmetic breakthroughs."
          />
          {/* Custom Red Underline Accent Bar */}
          <div className="w-20 h-1 bg-accent rounded-full mt-6" />
        </div>

        {/* 3 Milestone Cards Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {milestones.map((stone, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-white rounded-[16px] p-8 shadow-card flex flex-col items-start text-left border border-slate-100/50 border-t-4 border-t-primary relative hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Year label: crimson, serif */}
              <span className="font-serif font-bold text-3xl text-accent mb-4 block">
                {stone.year}
              </span>
              {/* Title: serif, teal, 24px */}
              <h3 className="font-serif font-bold text-2xl text-primary mb-3">{stone.title}</h3>
              {/* Description: gray body text */}
              <p className="text-sm sm:text-base text-body-text leading-relaxed font-sans font-normal">
                {stone.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default LegacyStory;
