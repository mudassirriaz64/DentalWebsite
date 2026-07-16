'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';

export const AboutCTA: React.FC = () => {
  return (
    <section className="py-20 md:py-24 bg-bg overflow-hidden">
      <Container>
        {/* Inset Rounded Card (32px radius, shadow, inset layout) */}
        <div className="bg-primary rounded-[32px] px-6 py-16 md:p-16 text-white text-center shadow-card border border-white/5 max-w-4xl mx-auto relative overflow-hidden">
          {/* Background overlay glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 to-primary-light/5 pointer-events-none -z-10" />

          <div className="max-w-[672px] mx-auto flex flex-col items-center">
            {/* Small label line */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="font-sans font-bold text-xs uppercase tracking-[1.4px] text-primary-light mb-4 block"
            >
              Get in Touch
            </motion.span>

            {/* Serif Paragraph */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl leading-snug text-white mb-8"
            >
              Join thousands of patients who have transformed their smiles under our dedicated care.
            </motion.h2>

            {/* Two Centered CTAs */}
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
                Book Appointment Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 border-2 border-primary-light text-primary-light hover:bg-primary-light hover:text-primary bg-transparent cursor-pointer"
              >
                Call for Emergency Care
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutCTA;
