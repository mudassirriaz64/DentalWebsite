'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/types/gallery';
import { resolveImageUrl, resolveThumbnailUrl } from '@/lib/media';
import { Check } from 'lucide-react';

interface GalleryCardProps {
  item: GalleryItem;
  onOpenLightbox: (item: GalleryItem, type?: 'main' | 'before' | 'after') => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onOpenLightbox }) => {
  // Before/After comparison slider states
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };


  const beforeImg = item.images.before ? resolveThumbnailUrl(item.images.before) : '';
  // Unified After media slot (supporting fallback to legacy main image)
  const afterImg = item.images.after
    ? resolveThumbnailUrl(item.images.after)
    : item.images.main
    ? resolveThumbnailUrl(item.images.main)
    : '';

  // 1. BEFORE/AFTER SLIDER CARD
  if (item.variant === 'comparison' && beforeImg && afterImg) {
    return (
      <div className="lg:col-span-2 rounded-[24px] overflow-hidden shadow-card border border-slate-100 flex flex-col justify-end relative h-[450px] group text-left">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="absolute inset-0 select-none cursor-ew-resize overflow-hidden bg-slate-900"
        >
          {/* AFTER Media (Always in background) */}
          {afterImg && (
              <Image
                src={afterImg}
                alt={item.images.after?.altText || 'After veneers restoration'}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
                priority
              />
          )}

          {/* BEFORE Media (Clip path overlay based on slider position) */}
          {beforeImg && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <Image
                  src={beforeImg}
                  alt={item.images.before?.altText || 'Before veneers restoration'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
            </div>
          )}

          {/* Slider Line Divider */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-lg pointer-events-none z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shadow-lg border border-slate-200">
              <span className="text-[10px] font-bold">↔</span>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full z-20 pointer-events-none">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-primary/80 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full z-20 pointer-events-none">
            After
          </div>
        </div>

        {/* Text Details Banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent z-10 pointer-events-none">
          <div className="flex justify-between items-end gap-6 pointer-events-auto">
            <div className="max-w-md">
              <h3 className="font-serif font-bold text-2xl text-white mb-2">{item.title}</h3>
              <p className="text-xs text-body-text-dark/95 font-sans leading-relaxed">
                {item.description}
              </p>
            </div>
            <button
              onClick={() => onOpenLightbox(item, 'after')}
              className="px-5 py-2.5 rounded-full bg-white text-primary hover:bg-slate-100 font-sans font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              Zoom Case
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. UNIFIED STANDARD SHOWCASE CARD (Images & Videos)
  return (
    <div
      onClick={() => onOpenLightbox(item, 'after')}
      className="lg:col-span-1 rounded-[24px] bg-white overflow-hidden shadow-card border border-slate-100 flex flex-col h-[450px] group cursor-pointer text-left hover:-translate-y-1.5 transition-transform duration-300 relative"
    >
      <div className="relative w-full h-[260px] overflow-hidden bg-slate-50">
        {afterImg && (
            <Image
              src={afterImg}
              alt={item.images.after?.altText || item.images.main?.altText || item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
        )}

        {item.isVerifiedPatient && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-primary-light text-primary font-sans font-bold text-[9px] uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
            <Check className="w-3 h-3 stroke-[3]" /> Verified Case
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="inline-flex text-[9px] font-sans font-bold text-accent uppercase tracking-wider mb-2">
            {item.category}
          </span>
          <h3 className="font-serif font-bold text-lg text-primary leading-tight mb-2">
            {item.title}
          </h3>
          <p className="text-xs text-body-text font-sans leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {(item.tags || []).slice(0, 2).map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-bg-alt border text-[9px] text-slate-500"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
