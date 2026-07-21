import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  variants?: Variants;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, variants }) => {
  const defaultFallback = '/images/home/dental-tech.png';
  const title = service?.title || 'Dental Service';
  const shortDescription = service?.shortDescription || service?.description || '';
  const slug = service?.slug || service?.id || 'service';
  
  const [imgSrc, setImgSrc] = useState(service?.imagePath || defaultFallback);

  useEffect(() => {
    setImgSrc(service?.imagePath || defaultFallback);
  }, [service?.imagePath]);

  // Safely parse and filter bullets array
  const rawBullets = Array.isArray(service?.bullets) ? service.bullets : [];
  const bullets = rawBullets.filter(
    (b): b is string => typeof b === 'string' && b.trim().length > 0
  );

  return (
    <motion.div
      variants={variants}
      className="rounded-3xl bg-white shadow-card border border-slate-100 flex flex-col justify-between h-full text-left group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    >
      {/* 1. TOP: Full-Width Prominent Photo Header */}
      <div className="relative w-full h-[210px] sm:h-[230px] overflow-hidden bg-slate-100 shrink-0">
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(defaultFallback)}
          unoptimized={typeof imgSrc === 'string' && imgSrc.startsWith('data:')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* CARD BODY: Content Order (Title -> Description -> Bullets -> Link) */}
      <div className="p-7 sm:p-8 flex flex-col flex-grow">
        <div className="flex flex-col flex-grow">
          {/* 2. Title */}
          <h3 className="font-serif font-bold text-2xl text-primary mb-3 tracking-tight">
            {title}
          </h3>

          {/* 3. Short Description */}
          {shortDescription && (
            <p className="text-sm text-body-text leading-relaxed font-sans font-normal mb-5">
              {shortDescription}
            </p>
          )}

          {/* 4. Bullets (rendered ONLY if non-empty string bullets exist) */}
          {bullets.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {bullets.map((bullet, idx) => (
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

        {/* 5. BOTTOM: Consistent Learn More Link */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <Link
            href={`/services/${slug}`}
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
