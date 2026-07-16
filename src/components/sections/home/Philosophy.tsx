'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

const values = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Precision & Safety',
    description:
      'Utilizing 3D cone-beam imaging and computer-guided implant placement for surgical perfection.',
  },
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: 'Patient-Centered Care',
    description:
      'Designed for low anxiety. Personalized sedation options and calming, tailored dental journeys.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'Aesthetic Artistry',
    description:
      'Crafting customized porcelain veneers and smile alignments that match your unique facial symmetry.',
  },
];

export const Philosophy: React.FC = () => {
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
    <section className="py-20 md:py-24 bg-bg-alt overflow-hidden">
      <Container className="flex flex-col items-center">
        {/* Header Block */}
        <div className="text-center flex flex-col items-center mb-16">
          <SectionHeading
            eyebrow="Our Philosophy"
            title="Aesthetic Artistry Meets Surgical Mastery"
            showDots={false}
            subtitle="We blend state-of-the-art technological precision with bespoke design to offer a signature dental experience."
          />
          {/* Custom Red Underline Accent Bar */}
          <div className="w-20 h-1 bg-accent rounded-full mt-6" />
        </div>

        {/* 3-Column Card Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-white rounded-[32px] p-8 md:p-10 shadow-card flex flex-col items-center text-center border border-slate-100/80 hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Mint Circle/Square wrapper for icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6 shadow-sm">
                {val.icon}
              </div>
              <h3 className="font-serif font-bold text-xl text-primary mb-4">{val.title}</h3>
              <p className="text-sm sm:text-base text-body-text leading-relaxed font-sans font-normal">
                {val.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default Philosophy;
