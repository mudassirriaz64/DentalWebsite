import React from 'react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { Cpu, Award, Smile } from 'lucide-react';

const valuesData = [
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Latest Technology',
    description: 'Using state-of-the-art 3D imaging and laser dentistry for painless precision.',
    bgColor: 'bg-primary-light text-primary',
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: 'Expert Doctors',
    description: 'Our clinicians are board-certified specialists in implants and cosmetic restorations.',
    bgColor: 'bg-accent-soft text-accent',
  },
  {
    icon: <Smile className="w-5 h-5" />,
    title: 'Patient Comfort',
    description: 'A luxury spa-like environment designed to keep you relaxed and anxiety-free.',
    bgColor: 'bg-primary-light text-primary',
  },
];

export const CoreValues: React.FC = () => {
  return (
    <section className="py-20 md:py-24 bg-bg-alt overflow-hidden text-center">
      <Container>
        <SectionHeading
          eyebrow="Core Values"
          title="Experience Excellence in Dentistry"
          align="center"
          showDots={true}
          className="mb-16 mx-auto"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto font-sans">
          {valuesData.map((val, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-100/50 shadow-sm hover:-translate-y-1.5 hover:shadow-card transition-all duration-300 flex flex-col items-center text-center text-dark-text"
            >
              {/* Alternating Icon Container */}
              <div className={`p-4 rounded-2xl ${val.bgColor} mb-6 flex items-center justify-center shadow-sm`}>
                {val.icon}
              </div>
              <h3 className="font-serif font-bold text-xl text-primary mb-3">
                {val.title}
              </h3>
              <p className="text-xs md:text-sm text-body-text leading-relaxed font-normal">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CoreValues;
