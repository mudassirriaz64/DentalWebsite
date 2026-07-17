import React from 'react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

export const ContactHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-bg overflow-hidden flex flex-col items-center">
      {/* Decorative ambient blobs */}
      <div className="absolute top-[10%] left-[5%] w-16 h-16 rounded-full bg-primary/5 blur-xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-24 h-24 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <Container className="flex flex-col items-center text-center">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's Create Your Perfect Smile"
          highlightedText="Smile"
          highlightColor="teal-clean"
          subtitle="Our expert team combines clinical precision with artistic vision to deliver world-class dental care. Reach out today for a consultation."
          align="center"
          showDots={true}
        />
      </Container>
    </section>
  );
};

export default ContactHero;
