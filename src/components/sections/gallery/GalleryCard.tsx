'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/types/gallery';
import { resolveImageUrl } from '@/lib/media';
import { Check, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const beforeImg = item.images.before ? resolveImageUrl(item.images.before) : '';
  const afterImg = item.images.after ? resolveImageUrl(item.images.after) : '';
  const mainImg = item.images.main ? resolveImageUrl(item.images.main) : '';

  // 1. BEFORE/AFTER SLIDER CARD
  if (item.variant === 'comparison') {
    return (
      <div className="lg:col-span-2 rounded-[24px] overflow-hidden shadow-card border border-slate-100 flex flex-col justify-end relative h-[450px] group text-left">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="absolute inset-0 select-none cursor-ew-resize overflow-hidden"
        >
          {/* AFTER Image (Always in background) */}
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

          {/* BEFORE Image (Clip path overlay based on slider position) */}
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

  // 2. TALL VERTICAL OVERLAY CARD
  if (item.variant === 'vertical') {
    return (
      <div
        onClick={() => onOpenLightbox(item, 'main')}
        className="lg:col-span-1 rounded-[24px] overflow-hidden shadow-card border border-slate-100 flex flex-col justify-end relative h-[450px] group cursor-pointer text-left"
      >
        {mainImg && (
          <Image
            src={mainImg}
            alt={item.images.main?.altText || item.title}
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover group-hover:scale-102 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

        <div className="p-6 relative z-20">
          <span className="inline-flex px-2 py-0.5 rounded bg-white/20 text-white font-sans text-[8px] uppercase tracking-wider font-bold mb-3">
            {item.category}
          </span>
          <h3 className="font-serif font-bold text-xl text-white mb-2">{item.title}</h3>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">{item.description}</p>
        </div>
      </div>
    );
  }

  // 3. SQUARE CARD WITH BADGE & CONTENT BELOW
  if (item.variant === 'square') {
    return (
      <div
        onClick={() => onOpenLightbox(item, 'main')}
        className="lg:col-span-1 rounded-[24px] bg-white overflow-hidden shadow-card border border-slate-100 flex flex-col h-[450px] group cursor-pointer text-left hover:-translate-y-1.5 transition-transform duration-300 relative"
      >
        <div className="relative w-full h-[260px] overflow-hidden bg-slate-50">
          {mainImg && (
            <Image
              src={mainImg}
              alt={item.images.main?.altText || item.title}
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
  }

  // 4. WIDE SPLIT CARD
  if (item.variant === 'wideSplit') {
    return (
      <div className="lg:col-span-2 rounded-[24px] overflow-hidden shadow-card border border-slate-100 grid grid-cols-1 md:grid-cols-2 h-[450px] group text-left">
        <div
          onClick={() => onOpenLightbox(item, 'main')}
          className="relative h-full bg-slate-50 overflow-hidden cursor-pointer"
        >
          {mainImg && (
            <Image
              src={mainImg}
              alt={item.images.main?.altText || item.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
          )}
          <div className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-sm text-white font-sans font-bold text-[9px] uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
            {item.category}
          </div>
        </div>

        <div className="bg-[#006030] p-8 md:p-10 flex flex-col justify-between text-white relative">
          {/* Subtle glowing spot */}
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div>
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-white mb-4 leading-tight">
              {item.title}
            </h3>
            <p className="text-xs md:text-sm text-body-text-dark/90 leading-relaxed font-sans font-normal mb-6">
              {item.description}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              {(item.tags || []).map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/5 text-[9px]"
                >
                  #{t}
                </span>
              ))}
            </div>
            <button
              onClick={() => onOpenLightbox(item, 'main')}
              className="w-fit inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-xs px-6 py-2.5 bg-white text-primary hover:bg-slate-100 shadow-sm cursor-pointer"
            >
              Zoom Case
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. SMALL COMPACT CARD
  return (
    <div
      onClick={() => onOpenLightbox(item, 'main')}
      className="lg:col-span-1 rounded-[24px] bg-[#C0C0C0] overflow-hidden shadow-card border border-slate-200/30 flex flex-col h-[450px] group cursor-pointer text-left hover:-translate-y-1.5 transition-transform duration-300 relative"
    >
      <div className="relative w-full h-[220px] overflow-hidden bg-slate-50">
        {mainImg && (
          <Image
            src={mainImg}
            alt={item.images.main?.altText || item.title}
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover group-hover:scale-102 transition-transform duration-500"
          />
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <span className="inline-flex text-[9px] font-sans font-bold text-[#5A5A5A] uppercase tracking-wider mb-2">
            {item.category}
          </span>
          <h3 className="font-serif font-bold text-lg text-primary leading-tight mb-2">
            {item.title}
          </h3>
          <p className="text-xs text-[#5A5A5A]/90 font-sans leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 mt-4">
          {(item.tags || []).slice(0, 3).map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-white/20 border border-white/10 text-[9px] text-[#5A5A5A]"
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
