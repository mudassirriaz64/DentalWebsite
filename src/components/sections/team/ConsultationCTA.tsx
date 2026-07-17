'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '@/data/services';
import Container from '@/components/ui/Container';

export const ConsultationCTA: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    service: services[0]?.title || '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: `Interested in: ${formData.service}`,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to submit request');
        }

        setIsSubmitted(true);
      } catch (err: any) {
        alert(err.message || 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <section className="py-20 md:py-24 bg-bg overflow-hidden">
      <Container>
        {/* Rounded inset card: 40px radius, white bg, shadow */}
        <div className="bg-white rounded-[40px] overflow-hidden shadow-card border border-slate-100 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Left Column: Image */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-slate-100">
            <Image
              src="/images/home/about-hero.png"
              alt="Patient Consultation"
              fill
              sizes="(max-width: 1024px) 100vw, 450px"
              className="object-cover"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-sans font-bold text-xs uppercase tracking-[1.4px] text-accent mb-3 block">
                    Bespoke Assessment
                  </span>
                  <h2 className="font-serif font-bold text-3xl text-hero-heading-dark mb-4 leading-tight">
                    Free Consultation
                  </h2>
                  <p className="text-sm text-body-text leading-relaxed font-sans font-normal mb-8 max-w-md">
                    Submit your credentials to book a private diagnostic review with our
                    specialists.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans">
                    {/* Row 1: Name and Dropdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="flex flex-col items-start w-full">
                        <label
                          htmlFor="cta-name"
                          className="text-xs font-bold uppercase text-hero-heading-dark mb-2"
                        >
                          Full Name *
                        </label>
                        <input
                          id="cta-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl bg-[#F0F3FF] border text-sm text-dark font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.name
                              ? 'border-accent/40 focus:ring-accent'
                              : 'border-transparent'
                          }`}
                          placeholder="Your Name"
                        />
                        {errors.name && (
                          <span className="text-xs text-accent mt-1">{errors.name}</span>
                        )}
                      </div>

                      {/* Dropdown */}
                      <div className="flex flex-col items-start w-full">
                        <label
                          htmlFor="cta-interest"
                          className="text-xs font-bold uppercase text-hero-heading-dark mb-2"
                        >
                          I&apos;m interested in...
                        </label>
                        <select
                          id="cta-interest"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#F0F3FF] border border-transparent text-sm text-dark font-sans focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                        >
                          {services.map((srv) => (
                            <option key={srv.id} value={srv.title}>
                              {srv.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Email and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Email input */}
                      <div className="flex flex-col items-start w-full">
                        <label
                          htmlFor="cta-email"
                          className="text-xs font-bold uppercase text-hero-heading-dark mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          id="cta-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl bg-[#F0F3FF] border text-sm text-dark font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.email
                              ? 'border-accent/40 focus:ring-accent'
                              : 'border-transparent'
                          }`}
                          placeholder="name@example.com"
                        />
                        {errors.email && (
                          <span className="text-xs text-accent mt-1">{errors.email}</span>
                        )}
                      </div>

                      {/* Phone input */}
                      <div className="flex flex-col items-start w-full">
                        <label
                          htmlFor="cta-phone"
                          className="text-xs font-bold uppercase text-hero-heading-dark mb-2"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="cta-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl bg-[#F0F3FF] border text-sm text-dark font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.phone
                              ? 'border-accent/40 focus:ring-accent'
                              : 'border-transparent'
                          }`}
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                          <span className="text-xs text-accent mt-1">{errors.phone}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 w-full sm:w-fit inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer self-start"
                    >
                      Get a Free Consultation
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="w-8 h-8"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-hero-heading-dark mb-3">
                    Consultation Requested
                  </h3>
                  <p className="text-sm text-body-text leading-relaxed font-sans font-normal mb-6">
                    Thank you, <span className="font-bold text-primary">{formData.name}</span>. Our
                    clinic coordinator will contact you at{' '}
                    <span className="font-semibold text-primary">{formData.phone}</span> within 24
                    business hours to confirm your private appointment.
                  </p>
                  <button
                    onClick={() => {
                      setFormData({
                        name: '',
                        service: services[0]?.title || '',
                        email: '',
                        phone: '',
                      });
                      setIsSubmitted(false);
                    }}
                    className="inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-6 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ConsultationCTA;
