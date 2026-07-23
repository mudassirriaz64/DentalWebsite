'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { GalleryItem } from '@/types/gallery';
import { resolveImageUrl } from '@/lib/media';

interface LightboxProps {
  item: GalleryItem | null;
  initialType?: 'main' | 'before' | 'after';
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ item, initialType = 'main', onClose }) => {
  const [activeType, setActiveType] = useState<'main' | 'before' | 'after'>(initialType);

  useEffect(() => {
    if (item) {
      setActiveType(initialType);
    }
  }, [item, initialType]);

  // Handle Escape key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  // Determine active display image
  const getActiveImage = () => {
    if (activeType === 'before' && item.images.before) return item.images.before;
    if (activeType === 'after' && item.images.after) return item.images.after;
    return item.images.main || item.images.after || item.images.before;
  };

  const activeImage = getActiveImage();
  const imageUrl = activeImage ? resolveImageUrl(activeImage) : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 select-none font-sans"
      >
        {/* Backdrop Close Click Area */}
        <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer active:scale-95"
          aria-label="Close case zoom"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Lightbox Content Container */}
        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#121C2C]/50 rounded-[32px] border border-white/5 p-6 md:p-8 backdrop-blur-xl overflow-hidden max-h-[90vh]">
          {/* Glowing element */}
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

          {/* Left Block: Image View (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center relative min-h-[300px] md:min-h-[450px]">
            <AnimatePresence mode="wait">
              {imageUrl && (
                <motion.div
                  key={`${item.id}-${activeType}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-slate-900 flex items-center justify-center"
                >
                  {(() => {
                    const isVideo =
                      imageUrl.toLowerCase().endsWith('.mp4') ||
                      imageUrl.toLowerCase().endsWith('.mov') ||
                      imageUrl.toLowerCase().endsWith('.webm') ||
                      imageUrl.includes('/video/upload/') ||
                      imageUrl.includes('/raw/upload/');

                    return isVideo ? (
                      <video
                        src={imageUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain focus:outline-none"
                      />
                    ) : (
                      <Image
                        src={imageUrl}
                        alt={activeImage?.altText || item.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 650px"
                        className="object-contain"
                        priority
                      />
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Before/After Toggle Pills */}
            {item.variant === 'comparison' && (
              <div className="flex gap-2.5 mt-5 bg-white/5 border border-white/10 p-1.5 rounded-full z-20">
                <button
                  onClick={() => setActiveType('before')}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeType === 'before'
                      ? 'bg-white text-primary shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  View Before
                </button>
                <button
                  onClick={() => setActiveType('after')}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeType === 'after'
                      ? 'bg-primary-light text-[#000000] shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  View After
                </button>
              </div>
            )}
          </div>

          {/* Right Block: Case Metadata Details (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left text-white mt-4 lg:mt-0 max-h-[480px] overflow-y-auto pr-2">
            <div>
              {/* Category & Status Badges */}
              <div className="flex flex-wrap gap-2.5 mb-5 items-center">
                <span className="px-3.5 py-1 rounded-full bg-accent-soft text-accent font-bold font-sans text-[10px] uppercase tracking-wider">
                  {item.category}
                </span>
                {item.isVerifiedPatient && (
                  <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#7AC943] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-light" /> Patient Verified
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-serif font-bold text-3xl leading-snug mb-4 tracking-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-body-text-dark/90 leading-relaxed font-sans font-normal mb-8">
                {item.description}
              </p>
            </div>

            {/* Structured details */}
            <div className="flex flex-col gap-6 pt-6 border-t border-white/5 text-xs text-body-text-dark">
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="w-4 h-4 text-primary-light flex-shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-white/5 border border-white/5 text-[10px] rounded text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Created */}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span>
                  Clinical Case log:{' '}
                  <span className="text-white font-semibold">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
