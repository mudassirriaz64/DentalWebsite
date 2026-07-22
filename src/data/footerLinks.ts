import { FooterSection } from '@/types';
import { services } from './services';

export const footerLinks: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Our Team', href: '/team' },
      { label: 'Reviews & Stories', href: '/reviews' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: services
      .filter((s) => s.featured)
      .map((s) => ({
        label: s.title,
        href: `/services#${s.id}`,
      })),
    viewAll: { label: 'View Services →', href: '/services' },
  },
];
