'use client';

import React from 'react';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { Star, ShieldCheck } from 'lucide-react';

interface ReviewsHeroProps {
  onOpenModal: () => void;
}

export const ReviewsHero: React.FC<ReviewsHeroProps> = ({ onOpenModal }) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-bg overflow-hidden flex flex-col items-center">
      {/* Glow blobs */}
      <div className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-32 h-32 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        {/* Left info column */}
        <div className="lg:col-span-7 flex flex-col">
          <SectionHeading
            eyebrow="Patient Satisfaction"
            title="Your Smiles, Our Greatest Reward"
            highlightedText="Greatest Reward"
            highlightColor="teal-clean"
            subtitle="Discover how our commitment to biological aesthetics, advanced technology, and patient-first care has transformed smiles and restored confidence."
            align="left"
            showDots={true}
            className="mb-8"
          />

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              onClick={onOpenModal}
              className="inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full text-xs px-8 py-3.5 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer"
            >
              Share Your Experience
            </button>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm select-none font-sans">
              <Star className="w-4 h-4 text-[#FFB020] fill-[#FFB020]" />
              <Star className="w-4 h-4 text-[#FFB020] fill-[#FFB020]" />
              <Star className="w-4 h-4 text-[#FFB020] fill-[#FFB020]" />
              <Star className="w-4 h-4 text-[#FFB020] fill-[#FFB020]" />
              <Star className="w-4 h-4 text-[#FFB020] fill-[#FFB020]" />
              <span className="text-xs font-bold text-[#000000] ml-1">4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Right graphic column */}
        <div className="lg:col-span-5 relative w-full h-[320px] md:h-[400px] rounded-[32px] overflow-hidden shadow-card border border-slate-100/50 bg-slate-100 group">
          <Image
            src="/images/home/hero-dentist.png"
            alt="Happy patient transformation smile"
            fill
            sizes="(max-width: 1024px) 100vw, 450px"
            className="object-cover group-hover:scale-102 transition-transform duration-750"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

          {/* Floating Glass testimonial Card overlay */}
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/85 backdrop-blur-md shadow-lg border border-white/40 flex items-start gap-3 select-none animate-fade-in font-sans">
            <div className="p-2 rounded-xl bg-primary-light text-primary flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Verified Smile Makeover
              </p>
              <p className="text-xs italic text-slate-700 font-medium leading-relaxed mt-1">
                "The custom veneers changed my life. I haven't stopped smiling since my appointment."
              </p>
              <p className="text-[10px] font-bold text-slate-900 mt-1">
                — Sarah J., Cosmetic Patient
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ReviewsHero;
