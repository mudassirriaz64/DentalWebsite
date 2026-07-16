'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Sparkles, Zap, Brain, Cpu } from 'lucide-react';
import Container from '@/components/ui/Container';

export const TechBento: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
    <section className="py-20 md:py-24 bg-white overflow-hidden">
      <Container>
        {/* Asymmetric 2-Column Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-16 text-left">
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="font-sans font-bold text-xs uppercase tracking-[1.4px] text-accent mb-3 block">
              Innovation
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-[40px] lg:leading-[50px] text-primary leading-tight tracking-tight">
              Pioneering the Future <br /> of Digital Dentistry
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="text-sm sm:text-base text-body-text leading-relaxed font-sans font-normal">
              We leverage neural-network diagnostic aids, computer-guided surgical guides, and
              soft-tissue lasers to ensure micron-perfect outcomes for all implant and aesthetic
              treatments.
            </p>
          </div>
        </div>

        {/* Asymmetric Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full lg:grid-rows-2 h-auto lg:h-[500px]"
        >
          {/* Card 1: 3D Digital Impressions (Left, spans 2 rows) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-1 lg:row-span-2 rounded-[24px] overflow-hidden shadow-card border border-slate-100 flex flex-col justify-end relative h-[350px] lg:h-full group cursor-pointer"
          >
            <Image
              src="/images/home/dental-tech.png"
              alt="3D Digital Impressions"
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent z-10" />

            <div className="p-8 relative z-20 flex flex-col items-start text-left w-full">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 text-primary-light">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-white mb-2">
                3D Digital Impressions
              </h3>
              <p className="text-xs sm:text-sm text-body-text-dark/90 leading-relaxed font-sans font-normal animate-fade-in">
                Eliminating uncomfortable molds with micron-perfect digital scans for crown and
                bridge work.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Laser Dentistry (Right top, spans 2 columns width) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-2 lg:row-span-1 rounded-[24px] bg-[#E7EEFF] p-8 shadow-card border border-slate-100/10 flex flex-col justify-center text-left h-[238px]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-primary mb-2">Laser Dentistry</h3>
                <p className="text-sm text-body-text leading-relaxed font-sans font-normal">
                  Minimally invasive soft tissue procedures that reduce bleeding and accelerate
                  healing times significantly.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: AI-Driven Diagnosis (Right bottom left, 1 column width) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-1 lg:row-span-1 rounded-[24px] bg-[#FFD9DC] p-6 shadow-card border border-slate-100/10 flex flex-col justify-between text-left h-[238px] group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-accent-dark mb-1">
                AI-Driven Diagnosis
              </h3>
              <p className="text-xs text-accent-dark/80 leading-relaxed font-sans font-normal">
                Early detection of potential issues using neural-network analysis.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Robotic Surgery (Right bottom right, 1 column width) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-1 lg:row-span-1 rounded-[24px] bg-[#DBE4E4] p-6 shadow-card border border-slate-100/10 flex flex-col justify-between text-left h-[238px] group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary mb-1">Robotic Surgery</h3>
              <p className="text-xs text-body-text leading-relaxed font-sans font-normal">
                Pinpoint accuracy for complex implant placements.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default TechBento;
