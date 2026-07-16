'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { getDoctorsByRole } from '@/data/doctors';
import { Doctor } from '@/types';

export const Visionaries: React.FC = () => {
  const [visionaries, setVisionaries] = React.useState<Doctor[]>([]);

  React.useEffect(() => {
    getDoctorsByRole('visionary').then(setVisionaries);
  }, []);

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
            eyebrow="Our Team"
            title="Meet the Visionaries"
            showDots={true}
            subtitle="Our multidisciplinary specialists bring decades of combined research and clinical excellence to cosmetic & implant medicine."
          />
        </div>

        {/* 3 Doctor Cards Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {visionaries.map((doc, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="flex flex-col items-start text-left group"
            >
              {/* Doctor Photo Container (480px tall, 24px radius, shadow) */}
              <div className="relative w-full h-[480px] rounded-[24px] overflow-hidden shadow-card border border-slate-100 bg-slate-100 flex-shrink-0 focus-within:ring-2 focus-within:ring-primary">
                <Image
                  src={doc.imagePath}
                  alt={doc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />

                {/* Hover Teal Overlay (opacity 0 -> 1) with View Profile White Pill Button */}
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <button className="px-6 py-2.5 bg-white text-primary font-sans font-bold text-xs uppercase tracking-wider rounded-full shadow-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer">
                    View Profile
                  </button>
                </div>
              </div>

              {/* Below Photo Contents */}
              <h3 className="font-serif font-bold text-2xl text-primary mt-6 mb-1 leading-tight">
                {doc.name}
              </h3>
              <span className="font-sans font-bold text-xs uppercase tracking-[0.7px] text-accent mb-3 block">
                {doc.title}
              </span>
              <p className="text-sm sm:text-base text-body-text leading-relaxed font-sans font-normal">
                {doc.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default Visionaries;
