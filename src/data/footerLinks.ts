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
    ],
  },
  {
    title: 'Services',
    links: services.map((s) => ({
      label: s.title,
      href: `/services#${s.id}`,
    })),
  },
];
