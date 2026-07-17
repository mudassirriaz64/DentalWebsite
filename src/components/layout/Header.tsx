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
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
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
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full border-b border-transparent',
          isScrolled
            ? 'bg-[rgba(249,249,255,0.9)] backdrop-blur-md shadow-sm py-3 border-border/30'
            : 'bg-transparent py-5'
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
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-sans font-bold text-[13px] tracking-wider uppercase transition-colors py-2 relative',
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
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.contact.phoneFormatted}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-body-text hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>{siteConfig.contact.phone}</span>
            </a>

            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-xs px-5 py-2.5 bg-accent text-white hover:bg-accent-hover btn-diagonal-stripe shadow-md cursor-pointer"
            >
              Book Consultation
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -mr-2 rounded-full lg:hidden text-body-text hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
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
      />
    </>
  );
};

export default Header;
