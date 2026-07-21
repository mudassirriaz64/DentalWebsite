'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Calendar, ShieldCheck, Clock, Award } from 'lucide-react';
import { Service } from '@/types';
import Container from '@/components/ui/Container';

interface ServiceDetailClientProps {
  service: Service;
}

export const ServiceDetailClient: React.FC<ServiceDetailClientProps> = ({ service }) => {
  const defaultFallback = '/images/home/dental-tech.png';
  const [imgSrc, setImgSrc] = useState(service.imagePath || defaultFallback);

  useEffect(() => {
    setImgSrc(service.imagePath || defaultFallback);
  }, [service.imagePath]);

  const fullDescription = service.description || service.shortDescription || '';
  const rawBullets = Array.isArray(service.bullets) ? service.bullets : [];
  const bullets = rawBullets.filter(
    (b): b is string => typeof b === 'string' && b.trim().length > 0
  );

  const contactUrl = `/contact?service=${encodeURIComponent(service.title)}`;

  return (
    <div className="bg-bg py-12 md:py-16">
      <Container>
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center gap-2 text-xs font-sans font-semibold text-body-text"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/services" className="hover:text-primary transition-colors">
            Services
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-primary font-bold">{service.title}</span>
        </motion.div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Detail Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Back Button */}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-hover mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Services</span>
            </Link>

            {/* Service Title */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-[48px] lg:leading-[56px] text-primary tracking-tight mb-6">
              {service.title}
            </h1>

            {/* Short / Intro Lead Text if distinct */}
            {service.shortDescription && service.description && (
              <p className="text-lg text-primary font-sans font-medium leading-relaxed mb-6">
                {service.shortDescription}
              </p>
            )}

            {/* Full Body Description */}
            <div className="prose prose-slate max-w-none mb-8 font-sans text-body-text leading-relaxed text-base">
              {fullDescription.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Highlights / Procedures Bullet List */}
            {bullets.length > 0 && (
              <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 mb-10">
                <h3 className="font-serif font-bold text-xl text-primary mb-5 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  <span>Key Clinical Highlights</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-bg-alt/70 border border-slate-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-sans font-semibold text-slate-800 leading-snug">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200/60 w-full">
              <Link
                href={contactUrl}
                className="inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full text-sm px-8 py-3.5 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Consultation
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent cursor-pointer"
              >
                Explore Other Services
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Hero Image & Booking Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-6 sticky top-28"
          >
            {/* Prominent Image Header */}
            <div className="relative w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden shadow-card border border-slate-100 bg-slate-100 group">
              <Image
                src={imgSrc}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover group-hover:scale-102 transition-transform duration-700"
                onError={() => setImgSrc(defaultFallback)}
                unoptimized={typeof imgSrc === 'string' && imgSrc.startsWith('data:')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white select-none">
                <span className="inline-block px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  Specialized Treatment
                </span>
                <h2 className="font-serif font-bold text-xl drop-shadow-sm">{service.title}</h2>
              </div>
            </div>

            {/* Patient Booking Assurance Card */}
            <div className="p-7 rounded-3xl bg-white shadow-card border border-slate-100 flex flex-col gap-4 text-left font-sans">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary-light text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-base">Bespoke Care Guarantee</h4>
                  <p className="text-xs text-body-text mt-0.5">Clinical excellence with zero anxiety.</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-body-text">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <span>30-Min Initial Diagnostic Evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Flexible Payment & Installment Options</span>
                </div>
              </div>

              <Link
                href={contactUrl}
                className="w-full text-center font-bold transition-all duration-300 rounded-full text-xs px-6 py-3.5 bg-primary text-white hover:bg-primary-hover shadow-md cursor-pointer mt-2"
              >
                Schedule Appointment for {service.title}
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default ServiceDetailClient;
