'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import HighlightText from './HighlightText';
import { getDoctorsByRole } from '@/data/doctors';
import { Doctor } from '@/types';

export const CoreTeam: React.FC = () => {
  const [core, setCore] = React.useState<Doctor[]>([]);

  React.useEffect(() => {
    getDoctorsByRole('core-team').then(setCore);
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
    <section className="py-20 md:py-24 bg-white overflow-hidden">
      <Container className="flex flex-col items-center">
        {/* Header Block */}
        <div className="text-center flex flex-col items-center mb-16 max-w-3xl">
          <span className="font-sans font-bold text-xs uppercase tracking-[1.4px] text-accent mb-3 block">
            Core Team
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-hero-heading-dark tracking-[-0.6px] leading-tight">
            Team of <HighlightText>doctors</HighlightText> of different specialties
          </h2>
        </div>

        {/* Core Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {core.map((doc) => (
            <motion.div
              key={doc.id}
              variants={cardVariants}
              className="flex flex-col text-left group"
            >
              {/* Photo Container: Desaturated/grayscale style */}
              <div className="relative w-full aspect-[394/493] rounded-[24px] overflow-hidden shadow-card border border-slate-100 bg-slate-100 shrink-0">
                <Image
                  src={doc.imagePath}
                  alt={doc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-101 transition-all duration-500"
                />
              </div>

              {/* Below-Photo Contents: Name in uppercase with Dr. prefix */}
              <h3 className="font-serif font-bold text-xl uppercase tracking-wide text-hero-heading-dark mt-6 mb-1">
                {doc.name}
              </h3>
              <span className="font-sans font-bold text-xs uppercase tracking-[0.7px] text-accent mb-3 block">
                {doc.title}
              </span>
              <p className="text-sm text-body-text leading-relaxed font-sans font-normal mb-5 flex-grow">
                {doc.bio}
              </p>

              <Link
                href="/contact"
                className="text-primary hover:text-accent font-sans font-bold text-sm flex items-center gap-1.5 transition-colors pb-1 w-fit group/link"
              >
                Make an appointment
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default CoreTeam;
