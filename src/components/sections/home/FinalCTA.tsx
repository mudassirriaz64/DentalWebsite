'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export const FinalCTA: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    const params = new URLSearchParams();
    params.set('name', fullName.trim());
    params.set('email', email.trim());
    
    router.push(`/contact?${params.toString()}`);
  };

  return (
    <section className="py-20 md:py-24 bg-bg overflow-hidden">
      <Container>
        {/* Large Rounded Content Box - 48px radius */}
        <div className="bg-primary rounded-[48px] p-8 md:p-16 text-white grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden shadow-card border border-white/5">
          {/* Subtle Background Blob */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          {/* Left Column: Form & Titles */}
          <div className="lg:col-span-7 flex flex-col items-start text-left relative z-10">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-white mb-6">
              Ready to Reveal Your Perfect Smile?
            </h2>
            <p className="text-body-text-dark/95 leading-relaxed text-sm sm:text-base mb-8 max-w-xl font-sans font-normal">
              Join thousands of patients who have transformed their lives through our clinical
              excellence. Book your first consultation today.
            </p>

            {/* Inline Appointment Request Form */}
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-lg shadow-sm">
                  ✓
                </div>
                <h3 className="font-serif font-bold text-xl text-white">Request Received!</h3>
                <p className="text-xs text-body-text-dark font-sans leading-relaxed">
                  Thank you. Our patient coordination team will connect with you within 2 business
                  hours to schedule your consultation.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="text-xs text-primary-light hover:underline font-bold mt-2 cursor-pointer"
                >
                  Request another consultation
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {/* Full Name Input */}
                  <div className="flex-1">
                    <label htmlFor="fullName" className="sr-only">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-light text-sm font-sans font-medium transition-all"
                    />
                  </div>
                  {/* Email Input */}
                  <div className="flex-1">
                    <label htmlFor="email" className="sr-only">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-light text-sm font-sans font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Validation Errors */}
                {validationError && (
                  <span className="text-accent-light text-xs font-bold font-sans self-start">
                    ⚠ {validationError}
                  </span>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  themeColor="accent"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto shadow-md mt-2 self-start"
                >
                  {isSubmitting ? 'Submitting...' : 'Book Your Consultation'}
                </Button>
              </form>
            )}
          </div>

          {/* Right Column: Bordered Frame Image */}
          <div className="lg:col-span-5 relative z-10 flex justify-center w-full">
            <div className="relative w-full max-w-[360px] aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden border-4 border-white/10 shadow-lg bg-slate-100/5">
              <Image
                src="/images/home/dental-tech.png"
                alt="State of the art dental implant technology"
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FinalCTA;
