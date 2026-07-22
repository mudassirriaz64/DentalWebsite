'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getServices } from '@/data/services';
import { Service } from '@/types';
import { ClinicSettings } from '@/types/settings';
import { MapPin, Phone, Mail, Clock, CheckCircle, ArrowRight, ExternalLink, Loader } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import WhatsAppIcon from '../../ui/WhatsAppIcon';

interface ContactGridProps {
  settings: ClinicSettings;
}

export const ContactGrid: React.FC<ContactGridProps> = ({ settings }) => {
  const searchParams = useSearchParams();
  const paramService = searchParams?.get('service');

  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then(setAvailableServices);
  }, []);

  // Form state
  const [fullName, setFullName] = useState('');
  const [serviceInterest, setServiceInterest] = useState('');

  useEffect(() => {
    if (paramService) {
      setServiceInterest(paramService);
    }
  }, [paramService]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);
  const [message, setMessage] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    // Client-side validations
    if (!fullName.trim()) return setErrorMsg('Full Name is required.');
    if (!serviceInterest) return setErrorMsg('Please select a service of interest.');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setErrorMsg('Please enter a valid email address.');
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      return setErrorMsg('Please enter a valid phone number (min 7 digits).');
    }
    const resolvedWhatsapp = whatsappSameAsPhone ? phone : whatsapp;
    if (!resolvedWhatsapp.trim() || resolvedWhatsapp.replace(/\D/g, '').length < 7) {
      return setErrorMsg('Please enter a valid WhatsApp number (min 7 digits).');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          serviceInterest,
          email,
          phone,
          whatsapp: resolvedWhatsapp,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit form.');
      }

      setSuccess(true);
      setFullName('');
      setServiceInterest('');
      setEmail('');
      setPhone('');
      setWhatsapp('');
      setWhatsappSameAsPhone(true);
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 pb-24 bg-bg overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: BOOKING FORM CARD (col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-10 shadow-card border border-slate-100/50 flex flex-col text-left">
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-primary mb-2">
              Free Consultation
            </h2>
            <p className="text-xs md:text-sm text-body-text mb-8 leading-relaxed font-normal">
              Fill out the form below and our treatment coordinator will contact you shortly.
            </p>

            {success ? (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                <h3 className="font-serif font-bold text-xl text-primary mb-2">
                  Request Received!
                </h3>
                <p className="text-xs text-body-text max-w-sm">
                  Thank you for booking with us. Our patient coordinator will review your request and reach out within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white font-sans text-xs font-bold cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-accent-soft text-accent border border-accent/10 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#333333] uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. John Smith"
                      className="px-4 py-3 bg-[#F0F0F0] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>

                  {/* Service Interest */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#333333] uppercase">Service Interest *</label>
                    <select
                      required
                      value={serviceInterest}
                      onChange={(e) => setServiceInterest(e.target.value)}
                      className="px-4 py-3 bg-[#F0F0F0] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs font-semibold text-slate-700"
                    >
                      <option value="">Select Service</option>
                      {availableServices.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#333333] uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="px-4 py-3 bg-[#F0F0F0] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#333333] uppercase">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="px-4 py-3 bg-[#F0F0F0] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-[#333333] uppercase">WhatsApp Number *</label>
                      <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={whatsappSameAsPhone}
                          onChange={(e) => {
                            setWhatsappSameAsPhone(e.target.checked);
                            if (e.target.checked) {
                              setWhatsapp('');
                            }
                          }}
                          className="rounded border-slate-300 text-primary focus:ring-primary w-3 h-3"
                        />
                        Same as Phone
                      </label>
                    </div>
                    <input
                      type="tel"
                      required
                      disabled={whatsappSameAsPhone}
                      value={whatsappSameAsPhone ? phone : whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp (with country code)"
                      className="px-4 py-3 bg-[#F0F0F0] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333333] uppercase">Message (Optional)</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your dental goals..."
                    className="px-4 py-3 bg-[#F0F0F0] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-fit flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-full text-xs px-8 py-3.5 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer mt-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4.5 h-4.5 animate-spin" /> Submitting Request...
                    </>
                  ) : (
                    <>
                      Get a Free Consultation <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: CLINIC INFORMATION & MAP (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            {/* A. Clinic Info Card */}
            <div className="bg-[#0B5E2F] text-white rounded-[32px] p-8 md:p-10 text-left relative overflow-hidden shadow-card border border-[#004020]">
              {/* Decorative accent circle */}
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

              <h3 className="font-serif font-bold text-2xl mb-6 text-[#7AC943]">
                Clinic Information
              </h3>

              <ul className="flex flex-col gap-5 text-xs md:text-sm font-sans font-normal mb-8">
                {/* Address */}
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-2.5 rounded-xl flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7AC943] mb-1">
                      Address
                    </h4>
                    <p className="text-slate-200 leading-relaxed font-normal">
                      {settings.address}
                    </p>
                  </div>
                </li>

                {/* Phone */}
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-2.5 rounded-xl flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-light" />
                  </div>
                  <div className="w-full">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7AC943] mb-1">
                      Phone
                    </h4>
                    <div className="flex flex-col gap-2">
                      <div>
                        <a
                          href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                          className="text-white font-bold text-base hover:underline block"
                        >
                          {settings.phone}
                        </a>
                        {settings.phoneNote && (
                          <span className="text-[10px] text-slate-300 font-semibold mt-0.5 block">
                            {settings.phoneNote}
                          </span>
                        )}
                      </div>
                      {settings.whatsapp && (
                        <div className="flex items-center gap-3 pt-1 border-t border-white/10">
                          <a
                            href={`tel:${settings.whatsapp.replace(/\D/g, '')}`}
                            className="text-white font-bold text-base hover:underline"
                          >
                            {settings.whatsapp}
                          </a>
                          <a
                            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-2 py-1 rounded-md"
                          >
                            <WhatsAppIcon className="w-3 h-3 fill-green-400" /> WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </li>

                {/* Email */}
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-2.5 rounded-xl flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7AC943] mb-1">
                      Email
                    </h4>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-200 hover:text-white font-semibold hover:underline block"
                    >
                      {settings.email}
                    </a>
                  </div>
                </li>
              </ul>

              {/* Divider */}
              <div className="h-px bg-white/10 my-6" />

              {/* Opening Hours */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7AC943] mb-4">
                  Opening Hours
                </h4>
                <div className="flex flex-col gap-2.5 text-xs">
                  {(settings.openingHours || []).map((oh) => (
                    <div
                      key={oh.id}
                      className={`flex justify-between items-center gap-4 ${
                        oh.isEmergencyNote
                          ? 'text-[#5A5A5A] font-semibold' // pale pink accent
                          : 'text-slate-200'
                      } ${oh.isDimmed ? 'opacity-50 font-normal' : ''}`}
                    >
                      <span>{oh.label}</span>
                      <span>{oh.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* B. Map Card */}
            <div className="relative rounded-[32px] h-[220px] overflow-hidden bg-slate-100 shadow-card border border-slate-100/50 group">
              <Image
                src="/images/contact/map.png"
                alt="Clinic directions location map"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25 z-10" />

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <a
                  href={settings.mapDirectionsUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary hover:bg-slate-100 hover:scale-105 font-sans font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-primary" /> Get Directions
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactGrid;
