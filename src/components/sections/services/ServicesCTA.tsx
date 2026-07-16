'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';

export const ServicesCTA: React.FC = () => {
  return (
    <section className="py-20 md:py-24 bg-dark text-white text-center overflow-hidden flex flex-col justify-center items-center">
      <Container className="max-w-[672px] flex flex-col items-center">
        {/* Serif White Heading (48px) */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-serif font-bold text-3xl sm:text-4xl lg:text-[48px] lg:leading-[58px] text-white tracking-[-0.96px] mb-6"
        >
          Ready to Coordinate Your Signature Smile?
        </motion.h2>

        {/* Light Gray Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="text-base sm:text-lg text-body-text-dark/80 leading-[29px] font-sans font-normal mb-10 max-w-xl"
        >
          Schedule an assessment with our cosmetic and implant experts today. We are committed to
          rendering results built for durability and aesthetics.
        </motion.p>

        {/* Two Centered Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto font-sans"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-lg cursor-pointer"
          >
            Book Consultation
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 border-2 border-white/20 text-white hover:bg-white/10 bg-transparent cursor-pointer"
          >
            Contact Clinic
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};

export default ServicesCTA;
