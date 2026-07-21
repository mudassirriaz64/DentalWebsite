'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { getDoctors } from '@/data/doctors';
import { Doctor } from '@/types';

export const DoctorsGrid: React.FC = () => {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    getDoctors().then(setAllDoctors);
  }, []);

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
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-20 md:py-24 bg-bg-alt overflow-hidden">
      <Container className="flex flex-col items-center">
        {/* Header Block */}
        <div className="text-center flex flex-col items-center mb-16 max-w-2xl">
          <SectionHeading
            eyebrow="Our Dental Specialists"
            title="World-Class Clinical Mastery & Artistic Vision"
            highlightedText="Clinical Mastery"
            highlightColor="teal-clean"
            subtitle="Meet our multidisciplinary team of cosmetic surgeons, implantologists, and aesthetic specialists dedicated to restoring your smile."
            align="center"
            showDots={true}
          />
        </div>

        {/* 3-Column Responsive Doctors Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
        >
          {allDoctors.map((doc, idx) => (
            <motion.div
              key={doc.id || idx}
              variants={cardVariants}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-slate-100 flex flex-col justify-between h-full text-left group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div>
                {/* Photo Frame */}
                <div className="relative w-full h-[260px] sm:h-[280px] rounded-2xl overflow-hidden bg-slate-100 mb-6 shrink-0">
                  <Image
                    src={doc.imagePath || '/images/home/doctor-elena.png'}
                    alt={doc.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Doctor Name & Title */}
                <h3 className="font-serif font-bold text-2xl text-primary mb-1 tracking-tight">
                  {doc.name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
                  {doc.title}
                </p>

                {/* Bio */}
                <p className="text-sm text-body-text leading-relaxed font-sans font-normal mb-5">
                  {doc.bio}
                </p>
              </div>

              {/* Action Link to Consultation */}
              <div className="pt-4 border-t border-slate-100 mt-auto">
                <Link
                  href={`/book-appointment?doctor=${encodeURIComponent(doc.id)}`}
                  className="text-primary hover:text-accent font-sans font-bold text-xs inline-flex items-center gap-1.5 transition-colors group/link"
                >
                  <span>Book Appointment with {doc.name.split(' ')[1] || doc.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default DoctorsGrid;
