import React from 'react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

export const GalleryHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-bg overflow-hidden flex flex-col items-center">
      {/* Soft glowing ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none -z-10" />

      <Container className="flex flex-col items-center text-center">
        <SectionHeading
          eyebrow="Transformation Gallery"
          title="Aesthetic Artistry in Every Smile"
          highlightedText="Smile"
          highlightColor="teal-clean"
          subtitle="Explore the clinical transformations achieved by our multidisciplinary specialists. Precision implants, bespoke veneers, and biometric alignments designed to restore form and confidence."
          align="center"
          showDots={true}
        />
      </Container>
    </section>
  );
};

export default GalleryHero;
