'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Container from '@/components/ui/Container';

export const Workflow: React.FC = () => {
  return (
    <section className="py-20 md:py-24 bg-[#0B5E2F] text-white overflow-hidden">
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Video Thumbnail */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-6 relative"
        >
          {/* Video wrapper - 592x333 ratio, rounded, drop shadow */}
          <div className="relative w-full aspect-[592/333] rounded-[24px] overflow-hidden shadow-lg border border-white/10 bg-slate-800 group">
            <Image
              src="/images/home/dental-tech.png"
              alt="Clinical Video Cover"
              fill
              sizes="(max-width: 768px) 100vw, 592px"
              className="object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-dark/20" />

            {/* Crimson Circular Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="w-16 h-16 rounded-full bg-play-button-bg text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 relative group/btn cursor-pointer"
                aria-label="Play video"
              >
                {/* Pulse ring animation */}
                <span className="absolute inset-0 rounded-full bg-play-button-bg/30 animate-ping group-hover/btn:animate-none" />
                <Play className="w-6 h-6 fill-white ml-1 text-white" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Workflow Quotes & Info */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col items-start text-left"
        >
          {/* Eyebrow Label */}
          <span className="font-sans font-bold text-xs uppercase tracking-[1.4px] text-primary-light mb-4 block">
            Workflow
          </span>

          {/* Serif Heading */}
          <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-[34px] lg:leading-[42px] text-white tracking-tight mb-6 max-w-xl">
            It&apos;s time to find freedom from pain so you can start living again.
          </h2>

          {/* Quote Block */}
          <blockquote className="text-base sm:text-lg text-body-text-dark/90 leading-relaxed font-sans font-normal italic border-l-2 border-primary-light pl-6 mb-8 max-w-xl">
            &ldquo;We must listen to the voices of health professionals, nurses, midwives, doctors
            and carers. We must allow the courage, ideas and innovations of patients and
            communities all over the world to inspire us.&rdquo;
          </blockquote>

          {/* Author Attribution: avatar + name + role */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-light bg-slate-100 shadow-sm flex-shrink-0">
              <Image
                src="/images/home/doctor-marcus.png"
                alt="Dr. Mark Wright"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-base text-white">Dr. Mark Wright</span>
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-primary-light mt-0.5">
                Head of Implantology
              </span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Workflow;
