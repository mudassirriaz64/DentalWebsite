'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Container from '@/components/ui/Container';

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '5K+', label: 'Smiles Transformed' },
  { value: '99%', label: 'Implant Success' },
  { value: '24/7', label: 'Priority Support' },
];

export const StatsBar: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="py-12 md:py-16 bg-dark text-white overflow-hidden">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full text-center"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col items-center justify-center"
            >
              {/* Big mint-colored number */}
              <span className="font-serif font-bold text-4xl md:text-5xl lg:text-[56px] text-primary-light mb-3 tracking-tight">
                {stat.value}
              </span>
              {/* Bold uppercase-tracked label in light blue-gray */}
              <span className="font-sans font-bold text-[11px] md:text-xs uppercase tracking-[2px] text-body-text-dark leading-tight">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default StatsBar;
