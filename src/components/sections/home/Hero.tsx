'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { ClinicSettings } from '@/types/settings';
import { SiteStat } from '@/types/reviews';

interface HeroProps {
  settings?: ClinicSettings | null;
  patientStat?: SiteStat | null;
  liveReviewsCount?: number;
}

export const Hero: React.FC<HeroProps> = ({ settings, patientStat, liveReviewsCount }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-bg">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10" />

      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text Block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary font-sans font-bold text-xs uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-extrabold">
              ✓
            </span>
            <span>Trusted by {patientStat?.value || '5,000+'} {patientStat?.label || 'Patients'}</span>
          </div>

          {/* H1 Headline */}
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-[48px] lg:leading-[58px] text-primary tracking-[-0.96px] mb-6 text-left">
            Transforming <span className="text-primary italic font-normal">Smiles</span> with Clinical Precision
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-body-text mb-8 max-w-xl leading-[29px] font-sans font-normal text-left">
            Setting the gold standard in cosmetic dentistry and implants. Our expert team combines
            clinical mastery with artistic vision to reveal your most radiant smile.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 w-full sm:w-auto mb-10">
            <Link
              href="/book-appointment"
              className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 bg-primary text-white hover:bg-primary-hover btn-diagonal-stripe shadow-lg cursor-pointer"
            >
              Book Appointment
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent cursor-pointer"
            >
              Our Services
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border/60 mb-6" />

          {/* Social Proof Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {[
                '/images/home/doctor-sarah.png',
                '/images/home/doctor-elena.png',
                '/images/home/doctor-marcus.png',
                '/images/home/patient-avatar.png',
              ].map((img, i) => (
                <div
                  key={i}
                  className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm"
                >
                  <Image
                    src={img}
                    alt="Happy Patient"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-body-text">
              <span className="font-bold text-dark-text">Trusted by {patientStat?.value || '5,000+'} Patients</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <div className="flex items-center gap-1 bg-accent-soft px-2.5 py-0.5 rounded-full text-accent font-bold text-xs border border-accent/15">
                ★ {liveReviewsCount || 50}+ Verified Reviews
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Large image with blobs and glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="lg:col-span-6 relative flex justify-center lg:justify-end"
        >
          {/* Layered Decorative Blobs */}
          <div className="absolute -top-6 -right-6 w-48 h-48 rounded-full bg-accent/5 blur-xl pointer-events-none -z-10" />
          <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full bg-primary/5 blur-xl pointer-events-none -z-10" />

          {/* Hero Image Container - 40px radius */}
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-card border border-white/50 bg-slate-100">
            <Image
              src="/images/home/hero-dentist.png"
              alt="Implant Specialist & Cosmetic Surgeon"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              priority
              className="object-cover"
            />
          </div>

          {/* Floating Glass Notification Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
            className="absolute bottom-6 left-6 md:-left-6 bg-white/80 backdrop-blur-md border border-white/60 p-4 rounded-[16px] shadow-lg flex items-center gap-3.5 max-w-[260px]"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Appointment Status
              </span>
              <span className="text-sm font-bold text-dark-text leading-tight mt-0.5">
                Availability
              </span>
              <span className="text-xs text-accent font-bold mt-0.5">{settings?.bookingStatusMessage || 'Accepting New Patients'}</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Hero;
