import { FooterSection } from '@/types';

export const footerLinks: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Our Team', href: '/our-team' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
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
