import { FooterSection } from '@/types';

export const footerLinks: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Our Team', href: '/team' },
    ],
  },
  {
    title: 'Specialties',
    links: [
      { label: 'Dental Implants', href: '/services#implants' },
      { label: 'Veneers & Whitening', href: '/services#veneers' },
      { label: 'Emergency Care', href: '/services#emergency' },
      { label: 'Orthodontics', href: '/services#orthodontics' },
    ],
  },
];
