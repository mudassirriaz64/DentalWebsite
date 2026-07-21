'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { footerLinks } from '@/data/footerLinks';
import { siteConfig } from '@/data/siteConfig';
import Container from '../ui/Container';
import Logo from '../ui/Logo';

interface FooterProps {
  settings?: any;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    facebook: <Facebook className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
  };

  // Resources links extracted from requirements
  const resourcesLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Emergency Care', href: '/services#emergency' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const getHoursSummary = () => {
    if (settings?.openingHours && settings.openingHours.length > 0) {
      const monFri = settings.openingHours.find((h: any) => 
        h.label.toLowerCase().includes('mon-fri') || h.label.toLowerCase().includes('monday')
      );
      const sat = settings.openingHours.find((h: any) => 
        h.label.toLowerCase().includes('sat') || h.label.toLowerCase().includes('saturday')
      );
      
      const parts = [];
      if (monFri) {
        parts.push(`Mon-Fri: ${monFri.hours}`);
      }
      if (sat) {
        parts.push(`Sat: ${sat.hours}`);
      }
      return parts.length > 0 ? parts.join(' · ') : 'Mon-Fri: 9-6 · Sat: Emergency Only';
    }
    
    if (siteConfig.contact.workingHours && siteConfig.contact.workingHours.length > 0) {
      const monFri = siteConfig.contact.workingHours.find((h: any) => 
        h.days.toLowerCase().includes('mon-fri') || h.days.toLowerCase().includes('monday')
      );
      const sat = siteConfig.contact.workingHours.find((h: any) => 
        h.days.toLowerCase().includes('sat') || h.days.toLowerCase().includes('saturday')
      );
      const parts = [];
      if (monFri) {
        parts.push(`Mon-Fri: ${monFri.hours}`);
      }
      if (sat) {
        parts.push(`Sat: ${sat.hours}`);
      }
      return parts.length > 0 ? parts.join(' · ') : 'Mon-Fri: 8-6 · Sat: 9-2';
    }
    
    return 'Mon-Fri: 9-6 · Sat: Emergency Only';
  };

  return (
    <footer className="bg-dark text-body-text-dark pt-10 pb-5 border-t border-slate-900">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-6 border-b border-white/10 text-left">
          {/* Brand Info Column */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Logo variant="dark" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-primary-light text-base sm:text-lg leading-tight">
                  Dental Cosmetic
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[1.6px] text-accent leading-none mt-1">
                  & Implant Centre
                </span>
              </div>
            </Link>
            <p className="text-xs text-body-text-dark/80 leading-relaxed font-sans font-normal">
              Setting the gold standard in cosmetic dentistry and implants. Precision medicine meets aesthetic excellence.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-1">
              {Object.entries(siteConfig.socialLinks).map(([platform, url]) => {
                const icon = socialIcons[platform as keyof typeof socialIcons];
                if (!icon || !url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-primary-light hover:text-dark transition-all duration-300 hover:-translate-y-0.5 text-body-text-dark"
                    aria-label={`Follow us on ${platform}`}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Links Columns (Company & Specialties) */}
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-white font-serif font-bold text-base">{section.title}</h3>
              <ul className="flex flex-col gap-2 text-xs font-sans font-normal">
                {section.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className={`hover:text-primary-light transition-all duration-300 hover:translate-x-1 inline-block ${
                        pathname === link.href
                          ? 'text-white font-bold'
                          : 'text-body-text-dark/80'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              {section.viewAll && (
                <li className="mt-1">
                  <Link href={section.viewAll.href} className="text-primary-light hover:underline text-[10px] font-bold tracking-wide w-fit">
                    {section.viewAll.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}

          {/* Clinic Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-serif font-bold text-base">Our Clinic</h3>
            <ul className="flex flex-col gap-2.5 text-xs font-sans font-normal">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-light flex-shrink-0 mt-0.5" />
                <a
                  href={settings?.mapDirectionsUrl || siteConfig.contact.addressMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-text-dark/80 hover:text-primary-light transition-colors leading-relaxed"
                >
                  {settings?.address || siteConfig.contact.address}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-light flex-shrink-0" />
                <a
                  href={`tel:${(settings?.phone || siteConfig.contact.phone).replace(/\s+/g, '')}`}
                  className="text-accent-soft hover:underline font-semibold transition-all duration-300"
                >
                  {settings?.phone || siteConfig.contact.phone}
                </a>
              </li>
              {settings?.emergencyPhone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-accent-soft flex-shrink-0" />
                  <a
                    href={`tel:${settings.emergencyPhone.replace(/\s+/g, '')}`}
                    className="text-accent-soft hover:underline font-semibold transition-all duration-300"
                  >
                    Emergency: {settings.emergencyPhone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2.5 border-t border-white/5 pt-2 mt-0.5">
                <Clock className="w-4 h-4 text-primary-light flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 w-full text-xs">
                  <span className="text-body-text-dark/80 font-normal leading-normal">
                    {getHoursSummary()}
                  </span>
                  <Link href="/contact" className="text-primary-light hover:underline text-[10px] font-bold tracking-wide w-fit">
                    View full hours →
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-[11px] text-body-text-dark/50">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-light transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
