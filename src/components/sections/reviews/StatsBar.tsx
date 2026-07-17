import React from 'react';
import Container from '@/components/ui/Container';
import { SiteStat } from '@/types/reviews';

interface StatsBarProps {
  stats: SiteStat[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <section className="bg-[#005252] text-white py-10 overflow-hidden shadow-inner select-none font-sans">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`flex flex-col gap-1 items-center justify-center p-2 ${
                index >= 2 ? 'pt-6 md:pt-2' : ''
              }`}
            >
              <span className="font-serif font-bold text-3xl md:text-4xl text-[#A0E9E8] tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-300">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StatsBar;
