import React from 'react';
import Link from 'next/link';
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

export const Footer: React.FC = () => {
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

  return (
    <footer className="bg-dark text-body-text-dark pt-16 pb-8 border-t border-slate-900">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand Info Column */}
          <div className="flex flex-col gap-5">
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
            <p className="text-sm text-body-text-dark/80 leading-relaxed font-sans font-normal">
              Setting the gold standard in cosmetic dentistry and implants. Precision medicine meets aesthetic excellence.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {Object.entries(siteConfig.socialLinks).map(([platform, url]) => {
                const icon = socialIcons[platform as keyof typeof socialIcons];
                if (!icon || !url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/5 hover:bg-primary-light hover:text-dark transition-all duration-300 hover:-translate-y-1 text-body-text-dark"
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
            <div key={section.title} className="flex flex-col gap-5">
              <h3 className="text-white font-serif font-bold text-lg">{section.title}</h3>
              <ul className="flex flex-col gap-3 text-sm font-sans font-normal">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-text-dark/80 hover:text-primary-light transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Clinic Column */}
          <div className="flex flex-col gap-5">
            <h3 className="text-white font-serif font-bold text-lg">Our Clinic</h3>
            <ul className="flex flex-col gap-4 text-sm font-sans font-normal">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <a
                  href={siteConfig.contact.addressMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-text-dark/80 hover:text-primary-light transition-colors leading-relaxed"
                >
                  {siteConfig.contact.address}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-light flex-shrink-0" />
                <a
                  href={siteConfig.contact.phoneFormatted}
                  className="text-accent-soft hover:underline font-semibold transition-all duration-300"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 border-t border-white/5 pt-3 mt-1">
                <Clock className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5 w-full text-xs">
                  <div className="flex justify-between gap-4 w-full text-body-text-dark/80">
                    <span>Mon–Fri:</span>
                    <span className="text-white font-semibold">8:00 AM – 7:00 PM</span>
                  </div>
                  <div className="flex justify-between gap-4 w-full text-body-text-dark/80">
                    <span>Sat:</span>
                    <span className="text-white font-semibold">9:00 AM – 2:00 PM</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-body-text-dark/50">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
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
