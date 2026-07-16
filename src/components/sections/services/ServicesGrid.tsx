'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  CheckSquare,
  Activity,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { services } from '@/data/services';
import { Service } from '@/types';

const iconMap = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  CheckSquare: <CheckSquare className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  PhoneCall: <PhoneCall className="w-6 h-6" />,
};

export const ServicesGrid: React.FC = () => {
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

  const renderCard = (service: Service) => {
    const Icon = iconMap[service.iconName as keyof typeof iconMap] || (
      <Activity className="w-6 h-6" />
    );

    switch (service.variant) {
      case 'large-image-card':
        return (
          <motion.div
            key={service.id}
            variants={cardVariants}
            className="lg:col-span-2 rounded-[12px] overflow-hidden shadow-card border border-slate-100 flex flex-col justify-end relative h-[380px] group cursor-pointer"
          >
            {service.imagePath && (
              <Image
                src={service.imagePath}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent z-10" />

            {/* Content overlay */}
            <div className="p-8 relative z-20 flex flex-col items-start text-left w-full">
              {/* Icon in soft teal background circle */}
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 text-primary-light">
                {Icon}
              </div>
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-white mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-body-text-dark/90 leading-relaxed font-sans font-normal max-w-md mb-4">
                {service.shortDescription}
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="text-primary-light font-sans font-bold text-sm flex items-center gap-1 hover:underline"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        );

      case 'dark-teal-card':
        return (
          <motion.div
            key={service.id}
            variants={cardVariants}
            className="lg:col-span-1 rounded-[12px] bg-primary p-8 shadow-card border border-slate-100/5 flex flex-col justify-between h-[380px] text-left relative overflow-hidden group cursor-pointer"
          >
            {/* Crimson blurred glowing spot in bottom-right corner */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent/20 blur-2xl pointer-events-none -z-10" />

            <div>
              {/* Icon in translucent white circle */}
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6 text-white shadow-sm">
                {Icon}
              </div>
              <h3 className="font-serif font-bold text-2xl text-white mb-3">{service.title}</h3>
              <p className="text-sm text-[#A0E9E8] leading-relaxed font-sans font-normal mb-6">
                {service.shortDescription}
              </p>
            </div>

            <Link
              href={`/services/${service.slug}`}
              className="w-full inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-6 py-2.5 bg-white text-primary hover:bg-slate-100 shadow-sm text-center cursor-pointer"
            >
              {service.ctaLabel || 'Learn More'}
            </Link>
          </motion.div>
        );

      case 'accent-pink-card':
        return (
          <motion.div
            key={service.id}
            variants={cardVariants}
            className="lg:col-span-1 rounded-[12px] bg-accent-soft p-8 shadow-card border border-slate-100/10 flex flex-col justify-between h-[380px] text-left cursor-pointer group"
          >
            <div>
              {/* Icon in solid crimson bg */}
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-6 text-white shadow-sm">
                {Icon}
              </div>
              <h3 className="font-serif font-bold text-2xl text-accent-dark mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-accent-dark/80 leading-relaxed font-sans font-normal mb-6">
                {service.shortDescription}
              </p>
            </div>

            <Link
              href={`/services/${service.slug}`}
              className="text-accent-dark hover:underline font-sans font-bold text-sm block border-b border-accent-dark/20 pb-0.5 w-fit"
            >
              {service.ctaLabel || 'Learn More'}
            </Link>
          </motion.div>
        );

      case 'white-card':
      default:
        return (
          <motion.div
            key={service.id}
            variants={cardVariants}
            className="lg:col-span-1 rounded-[12px] bg-white p-8 shadow-card border border-slate-100 flex flex-col justify-between h-[380px] text-left cursor-pointer group hover:-translate-y-1.5 transition-transform duration-300 relative overflow-hidden"
          >
            <div>
              {/* Icon on soft gray-teal bg (#DBE4E4), Icon color (#404849) */}
              <div className="w-10 h-10 rounded-full bg-[#DBE4E4] flex items-center justify-center mb-6 text-[#404849] shadow-sm">
                {Icon}
              </div>
              <h3 className="font-serif font-bold text-2xl text-primary mb-3">{service.title}</h3>
              <p className="text-sm text-body-text leading-relaxed font-sans font-normal">
                {service.shortDescription}
              </p>
            </div>

            {/* Optional embedded image bottom overlay or link */}
            {service.imagePath ? (
              <div className="relative w-full h-[100px] rounded-lg overflow-hidden mt-4 shadow-sm border border-slate-200/50 bg-slate-50">
                <Image
                  src={service.imagePath}
                  alt={service.title}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
            ) : (
              <Link
                href={`/services/${service.slug}`}
                className="text-primary hover:underline font-sans font-bold text-sm flex items-center gap-1 mt-6"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        );
    }
  };

  return (
    <section id="services-list" className="py-20 md:py-24 bg-bg-alt overflow-hidden">
      <Container>
        {/* Header containing heading, description, and slider navigation controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16 w-full">
          <div className="max-w-2xl text-left">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-primary leading-tight mb-4">
              Clinical Excellence & Bespoke Services
            </h2>
            <p className="text-sm sm:text-base text-body-text font-sans leading-relaxed font-normal">
              Explore our range of clinical dental treatments, structured around biometric stability
              and aesthetic perfection.
            </p>
          </div>

          {/* Prev/Next Arrow Carousel Navigation Outline Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="p-2.5 rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="p-2.5 rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              aria-label="Next service"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bento Grid layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
        >
          {services.map((service) => renderCard(service))}
        </motion.div>
      </Container>
    </section>
  );
};

export default ServicesGrid;
