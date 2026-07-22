'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Phone, Mail, MapPin } from 'lucide-react';
import { NavLink } from '@/types';
import { siteConfig } from '@/data/siteConfig';
import Button from '../ui/Button';

import WhatsAppIcon from '../ui/WhatsAppIcon';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  settings?: any;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links, settings }) => {
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants: Variants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: { type: 'spring' as const, damping: 25, stiffness: 200 },
    },
    exit: {
      x: '100%',
      transition: { ease: 'easeInOut' as const, duration: 0.3 },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <span className="font-serif font-extrabold text-dark text-lg leading-tight">
                {siteConfig.shortName}
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-dark transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-8 px-6">
              <motion.nav variants={containerVariants} className="flex flex-col gap-6">
                {links.map((link) => (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="text-xl font-semibold text-dark hover:text-primary transition-colors block py-1"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Contact details */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col gap-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Information
                </h4>

                <div className="flex flex-col gap-4 text-sm text-slate-600">
                  <a
                    href={`tel:${(settings?.phone || siteConfig.contact.phone).replace(/\s+/g, '')}`}
                    className="flex items-center gap-3 hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{settings?.phone || siteConfig.contact.phone}</span>
                  </a>
                  {settings?.whatsapp && (
                    <div className="flex items-center justify-between">
                      <a
                        href={`tel:${settings.whatsapp.replace(/\D/g, '')}`}
                        className="flex items-center gap-3 hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{settings.whatsapp}</span>
                      </a>
                      <a
                        href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <WhatsAppIcon className="w-4 h-4 fill-emerald-500" /> WhatsApp
                      </a>
                    </div>
                  )}
                  <a
                    href={`mailto:${settings?.email || siteConfig.contact.email}`}
                    className="flex items-center gap-3 hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{settings?.email || siteConfig.contact.email}</span>
                  </a>
                  <a href={settings?.mapDirectionsUrl || siteConfig.contact.addressMapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-primary transition-colors">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{settings?.address || siteConfig.contact.address}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Button Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col">
              <Link
                href="/book-appointment"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-6 py-3 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer text-center"
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
