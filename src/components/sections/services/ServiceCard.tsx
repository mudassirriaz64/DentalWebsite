'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  Sparkles,
  Shield,
  CheckSquare,
  Activity,
  PhoneCall,
  ArrowRight,
  Smile,
  HeartPulse,
  Stethoscope,
} from 'lucide-react';
import { Service } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  CheckSquare: <CheckSquare className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  PhoneCall: <PhoneCall className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Stethoscope: <Stethoscope className="w-5 h-5" />,
};

interface ServiceCardProps {
  service: Service;
  variants?: Variants;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, variants }) => {
  const Icon = iconMap[service.iconName] || <Activity className="w-5 h-5" />;

  // Requirement 3: Option (a) Generic fallback image for visual rhythm across all grid cards
  const displayImage = service.imagePath || '/images/home/dental-tech.png';

  return (
    <motion.div
      variants={variants}
      className="rounded-3xl bg-white shadow-card border border-slate-100 flex flex-col justify-between h-full text-left group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    >
      {/* 1. TOP: Prominent Full-Width Photo Header */}
      <div className="relative w-full h-[210px] sm:h-[230px] overflow-hidden bg-slate-100 shrink-0">
        <Image
          src={displayImage}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* CARD BODY: Content Order (Icon -> Title -> Description -> Bullets -> Link) */}
      <div className="p-7 sm:p-8 flex flex-col flex-grow justify-between">
        <div className="flex flex-col flex-grow">
          {/* 2. Icon Circle */}
          <div className="w-11 h-11 rounded-full bg-[#DBE4E4] flex items-center justify-center mb-5 text-[#404849] shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
            {Icon}
          </div>

          {/* 3. Title */}
          <h3 className="font-serif font-bold text-2xl text-primary mb-3 tracking-tight">
            {service.title}
          </h3>

          {/* 4. Short Description */}
          <p className="text-sm text-body-text leading-relaxed font-sans font-normal mb-5 flex-grow">
            {service.shortDescription}
          </p>

          {/* 5. Bullets (rendered ONLY if present) */}
          {service.bullets && service.bullets.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {service.bullets.map((bullet, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 text-xs font-sans font-medium px-3 py-1.5 rounded-full border border-slate-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {bullet}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 6. BOTTOM: Consistent Learn More Link */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <Link
            href={`/services/${service.slug}`}
            className="text-primary hover:text-accent font-sans font-bold text-sm inline-flex items-center gap-1.5 transition-colors group/link"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
