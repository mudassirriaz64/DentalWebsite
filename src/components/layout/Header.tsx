'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone } from 'lucide-react';
import { navLinks } from '@/data/navLinks';
import { siteConfig } from '@/data/siteConfig';
import Logo from '../ui/Logo';
import Container from '../ui/Container';
import Button from '../ui/Button';
import MobileMenu from './MobileMenu';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { cn } from '@/lib/utils';

export const Header: React.FC<{ settings?: any }> = ({ settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-40 transition-all duration-300 w-full border-b',
          isScrolled
            ? 'bg-bg/95 backdrop-blur-md shadow-sm py-3 border-slate-200/60'
            : 'bg-bg/90 backdrop-blur-md py-4 border-slate-100/60'
        )}
      >
        <Container className="flex items-center justify-between">
          {/* Logo - Teal vector icon + wordmark in Libre Caslon Text */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="w-14 h-14 group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-primary tracking-tight text-xl sm:text-2xl leading-none">
                Dental Cosmetic
              </span>
              <span className="text-[9px] uppercase font-bold tracking-[1.6px] text-accent leading-none mt-1">
                & Implant Centre
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Manrope 14px bold, uppercase, tracking */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-sans font-bold text-[13px] tracking-wider uppercase transition-colors py-2 relative whitespace-nowrap',
                    isActive ? 'text-primary' : 'text-body-text hover:text-primary'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-2 lg:border-l lg:border-slate-200/80 lg:pl-5 xl:pl-6">
            {/* Call Icon-only button */}
            <a
              href={`tel:${(settings?.phone || siteConfig.contact.phone).replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex items-center justify-center p-2 rounded-xl text-body-text hover:text-primary hover:bg-slate-50 transition-colors shrink-0"
              title={`Call us: ${settings?.phone || siteConfig.contact.phone}`}
              aria-label={`Call us at ${settings?.phone || siteConfig.contact.phone}`}
            >
              <Phone className="w-4 h-4 text-primary shrink-0" />
            </a>

            {/* WhatsApp Icon-only button */}
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center justify-center p-2 rounded-xl text-body-text hover:text-primary hover:bg-slate-50 transition-colors shrink-0 hover:scale-110 transition-transform"
                title={`WhatsApp us: ${settings.whatsapp}`}
                aria-label={`Message us on WhatsApp at ${settings.whatsapp}`}
              >
                <WhatsAppIcon className="w-4 h-4 fill-emerald-500 hover:fill-emerald-600 transition-colors" />
              </a>
            )}

            {/* Book Appointment CTA */}
            <Link
              href="/book-appointment"
              className="hidden md:inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-xs px-4 py-2 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Appointment
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -mr-2 rounded-full lg:hidden text-body-text hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
        settings={settings}
      />
    </>
  );
};

export default Header;
