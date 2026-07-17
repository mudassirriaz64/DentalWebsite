import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';

export const GalleryCTA: React.FC = () => {
  return (
    <section className="py-20 md:py-24 bg-bg overflow-hidden text-center">
      <Container>
        {/* Light Lavender Card with 40px radius */}
        <div className="bg-[#F0F3FF] rounded-[40px] p-10 md:p-16 max-w-5xl mx-auto flex flex-col items-center relative overflow-hidden shadow-sm border border-slate-100/50">
          {/* Decorative circular rings in bottom-right */}
          <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 rounded-full border-[16px] border-primary/5 pointer-events-none" />
          <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 rounded-full border-[32px] border-primary/5 pointer-events-none" />

          <div className="relative z-10 max-w-2xl flex flex-col items-center">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-primary leading-tight mb-4">
              Ready for your transformation?
            </h2>
            <p className="text-sm md:text-base text-body-text font-sans leading-relaxed font-normal mb-8 max-w-lg">
              Schedule a diagnostics consultation with our cosmetic surgery team and design your ideal smile makeovers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 font-sans justify-center items-center w-full sm:w-auto">
              <Link
                href="/team#consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer"
              >
                Book a Consultation
              </Link>
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent transition-colors cursor-pointer"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default GalleryCTA;
