'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Container from '@/components/ui/Container';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const TeamFAQ: React.FC = () => {
  const [openId, setOpenId] = React.useState<string | null>('faq-1');

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'How do I access my lab test results?',
      answer:
        'Your dental laboratory results and digital scans can be accessed through our secure patient portal. Once our specialists have reviewed the findings, you will receive a notification to view your complete clinical report and proposed treatment plan.',
    },
    {
      id: 'faq-2',
      question: 'What should I expect during my first consultation?',
      answer:
        'During your initial examination, our team will perform a complete clinical evaluation, including low-radiation digital scans, and outline a customized treatment plan tailored to your aesthetic goals. {/* TODO: confirm real copy later in morning block */}',
    },
    {
      id: 'faq-3',
      question: 'Do you provide emergency dental care?',
      answer:
        'Yes, we provide priority scheduling for acute dental pain, trauma, or urgent care needs to ensure immediate relief. {/* TODO: confirm real copy later in morning block */}',
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-bg-alt overflow-hidden">
      <Container className="max-w-[768px] flex flex-col items-center">
        {/* Header Block */}
        <div className="text-center flex flex-col items-center mb-16">
          <span className="font-sans font-bold text-xs uppercase tracking-[1.4px] text-accent mb-3 block">
            FAQ
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-hero-heading-dark tracking-[-0.6px]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="w-full flex flex-col gap-4 font-sans">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-[16px] border border-slate-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-hero-heading-dark hover:text-primary transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {/* Animated content expansion */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-slate-100 text-sm text-body-text leading-relaxed font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default TeamFAQ;
