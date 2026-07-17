import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CalendarClock, ShieldCheck, HeartPulse } from 'lucide-react';

const benefits = [
  {
    icon: <HeartPulse className="w-5 h-5 text-accent-soft" />,
    title: 'Emergency 24/7',
    desc: 'Round-the-clock priority clinic assistance.',
  },
  {
    icon: <CalendarClock className="w-5 h-5 text-primary-light" />,
    title: 'Weekend Booking',
    desc: 'Flexible Saturday clinical appointments.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-primary-light" />,
    title: 'Advanced Care',
    desc: 'Safe biological hygiene sterilization.',
  },
  {
    icon: <ShieldAlert className="w-5 h-5 text-accent-soft" />,
    title: 'Expert Doctors',
    desc: 'Certified cosmetic surgical specialists.',
  },
];

export const BottomCTA: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-bg overflow-hidden font-sans text-left">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Dark Teal Background card */}
        <div className="bg-[#003838] text-white rounded-[40px] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-[#002828] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Blurred decorative radial gradient */}
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="absolute top-[-100px] right-[-100px] w-80 h-80 rounded-full bg-primary-light/10 blur-3xl pointer-events-none" />

          {/* Left Column: Heading and buttons */}
          <div className="lg:col-span-6 flex flex-col">
            <span className="text-[10px] font-bold text-accent-soft uppercase tracking-widest block mb-3">
              Start Your Journey
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
              Ready for Your Own Smile Makeover?
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal mb-8 max-w-md">
              Schedule a private assessment to review your cosmetic goals. Our specialists are here to design a personalized treatment blueprint for you.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full text-xs px-8 py-3.5 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer"
              >
                Book Now
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full text-xs px-8 py-3.5 border-2 border-white/20 text-white hover:bg-white hover:text-primary cursor-pointer"
              >
                Our Services
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 glass benefits card grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-between items-start text-left shadow-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 select-none"
              >
                <div className="p-2.5 rounded-xl bg-white/10 mb-4 flex items-center justify-center shadow-inner">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#A0E9E8] mb-1">
                    {b.title}
                  </h3>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-normal font-sans">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BottomCTA;
