'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { Doctor } from '@/types';
import { resolveImageUrl } from '@/lib/media';

export const Visionaries: React.FC = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((docs: Doctor[]) => {
        const featured = docs.filter((d) => d.featured);
        if (featured.length >= 3) {
          setFeaturedDoctors(featured.slice(0, 3));
        } else {
          const needed = 3 - featured.length;
          const nonFeatured = docs.filter((d) => !d.featured).slice(0, needed);
          setFeaturedDoctors([...featured, ...nonFeatured]);
        }
      })
      .catch(() => {});
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
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-20 md:py-24 bg-bg-alt overflow-hidden">
      <Container className="flex flex-col items-center">
        {/* Header Block */}
        <div className="text-center flex flex-col items-center mb-16">
          <SectionHeading
            eyebrow="Clinical Leadership"
            title="Meet Our Specialists"
            showDots={true}
            subtitle="Our multidisciplinary specialists bring decades of combined research and clinical excellence to cosmetic & implant medicine."
          />
        </div>

        {/* 3 Doctor Cards Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={featuredDoctors.length > 0 ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12 min-h-[400px]"
        >
          {featuredDoctors.map((doc, idx) => (
            <motion.div
              key={doc.id || idx}
              variants={cardVariants}
              className="flex flex-col items-start text-left group"
            >
              {/* Doctor Photo Container */}
              <div className="relative w-full h-[400px] sm:h-[420px] rounded-[24px] overflow-hidden shadow-card border border-slate-100 bg-slate-100 flex-shrink-0">
                <Image
                  src={resolveImageUrl(doc.imagePath, '/images/home/doctor-elena.png')}
                  alt={doc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
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

        {/* View Full Team CTA */}
        <Link
          href="/team"
          className="inline-flex items-center gap-2 font-bold transition-all duration-300 rounded-full text-xs px-8 py-3.5 bg-primary text-white hover:bg-primary-hover shadow-md cursor-pointer"
        >
          <span>View Full Team</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Container>
    </section>
  );
};

export default Visionaries;
