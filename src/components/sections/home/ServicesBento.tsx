'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Sparkles, Activity, PhoneCall } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export const ServicesBento: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="py-20 md:py-24 bg-bg overflow-hidden">
      <Container>
        {/* Section Header with Left-Right Space Between */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16 w-full">
          <SectionHeading
            eyebrow="Our Services"
            title="Bespoke Treatments Designed for You"
            showDots={true}
            align="left"
            className="max-w-xl"
          />
          <Link
            href="/services"
            className="text-sm font-bold text-accent hover:text-primary transition-colors flex items-center gap-1.5 group shrink-0"
          >
            <span>View All Services</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Bento Grid layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
        >
          {/* Card 1: Advanced Dental Implants (2/3 width, tall) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-2 rounded-[40px] overflow-hidden shadow-card border border-slate-100 flex flex-col justify-end relative h-[450px] group cursor-pointer"
          >
            {/* Background Image */}
            <Image
              src="/images/home/dental-implants.png"
              alt="Advanced Dental Implants"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent z-10" />

            {/* Content Overlays */}
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-accent text-white font-sans font-bold text-[10px] tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-sm">
                Featured
              </span>
            </div>

            <div className="p-8 md:p-10 relative z-20 flex justify-between items-end gap-6 w-full">
              <div className="max-w-md text-left">
                <h3 className="font-serif font-bold text-2xl md:text-3xl text-white mb-3">
                  Advanced Dental Implants
                </h3>
                <p className="text-sm md:text-base text-body-text-dark/90 leading-relaxed font-sans font-normal">
                  Restoring function and aesthetics with titanium precision. Lifetime durability for a
                  confident life.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Cosmetic Dentistry (1/3 width, dark teal bg) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-1 rounded-[40px] bg-primary p-8 md:p-10 shadow-card border border-slate-100/5 flex flex-col justify-between h-[450px] relative text-left"
          >
            <div>
              {/* Icon wrapper */}
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6 text-primary-light">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-white mb-4">Cosmetic Dentistry</h3>
              <p className="text-sm text-body-text-dark/90 leading-relaxed font-sans font-normal mb-6">
                From veneers to professional whitening, we craft your most radiant smile yet.
              </p>
            </div>

            {/* Bullets List */}
            <ul className="flex flex-col gap-3.5 font-sans">
              {['Porcelain Veneers', 'In-Office Teeth Whitening', 'Cosmetic Bonding'].map(
                (bullet, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 rounded-md bg-accent flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                    <span className="font-semibold text-white">{bullet}</span>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Card 3: Orthodontics (1/3 width, light blue bg) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-1 rounded-[40px] bg-bg-blue-soft p-8 md:p-10 shadow-card border border-slate-100/10 flex flex-col justify-between h-[450px] text-left relative overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-primary mb-4">Orthodontics</h3>
              <p className="text-sm text-body-text leading-relaxed font-sans font-normal">
                Discreet alignment solutions including Invisalign and ceramic braces for all ages.
              </p>
            </div>

            {/* Embedded image at the bottom of the card */}
            <div className="relative w-full h-[160px] rounded-2xl overflow-hidden mt-6 shadow-sm border border-slate-200/50 bg-slate-100">
              <Image
                src="/images/home/orthodontics.png"
                alt="Orthodontics Alignment"
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Card 4: Emergency Care? (2/3 width, pink bg, dark red text) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-2 rounded-[40px] bg-accent-soft p-8 md:p-10 shadow-card border border-slate-100/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 h-auto lg:h-[450px] text-left relative overflow-hidden"
          >
            <div className="flex-grow flex flex-col items-start justify-between h-full py-2">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-sans font-bold text-xs uppercase tracking-wider mb-6">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>24/7 Priority Support</span>
                </div>
                <h3 className="font-serif font-bold text-2xl md:text-3xl text-accent-dark mb-4">
                  Emergency Care?
                </h3>
                <p className="text-sm md:text-base text-accent-dark/80 leading-relaxed font-sans font-normal mb-8 max-w-md">
                  Acute pain or accidents? Our emergency team is ready to assist you within 2 hours
                  of contact.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-6 py-3 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer text-center"
              >
                Book Emergency Visit
              </Link>
            </div>

            {/* Floating Glass patient review widget on the right */}
            <div className="relative w-full md:w-auto md:min-w-[280px] h-[190px] flex items-center justify-center bg-white/50 border border-white/60 rounded-3xl p-6 shadow-sm backdrop-blur-md self-center">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white mb-3 bg-slate-100">
                  <Image
                    src="/images/home/doctor-marcus.png"
                    alt="Dr. Marcus"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <h4 className="font-sans font-bold text-dark-text text-sm leading-tight">
                  Prompt Service
                </h4>
                <div className="flex items-center gap-0.5 text-accent my-1.5 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 font-semibold max-w-[200px]">
                  "Saw me in 45 minutes for a chipped tooth!"
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ServicesBento;
