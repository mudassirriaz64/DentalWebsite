import { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'cosmetic-artistry',
    title: 'Cosmetic Artistry',
    shortDescription:
      'Transform your appearance with bespoke veneers, professional whitening, and gum contouring designed for biological harmony.',
    description:
      'Transform your appearance with bespoke veneers, professional whitening, and gum contouring designed for biological harmony.',
    slug: 'cosmetic-artistry',
    iconName: 'Sparkles',
    variant: 'large-image-card',
    imagePath: '/images/home/cosmetic-smile.png',
  },
  {
    id: 'dental-implants',
    title: 'Dental Implants',
    shortDescription:
      'Permanent restorative solutions using titanium or ceramic posts to replace missing teeth with unmatched stability and natural aesthetics.',
    description:
      'Permanent restorative solutions using titanium or ceramic posts to replace missing teeth with unmatched stability and natural aesthetics.',
    slug: 'dental-implants',
    iconName: 'Shield',
    variant: 'dark-teal-card',
    ctaLabel: 'Learn More',
  },
  {
    id: 'preventive-care',
    title: 'Preventive Care',
    shortDescription:
      'Advanced diagnostics, regular hygiene therapy, and protective treatments to ensure long-term oral stability.',
    description:
      'Advanced diagnostics, regular hygiene therapy, and protective treatments to ensure long-term oral stability.',
    slug: 'preventive-care',
    iconName: 'CheckSquare',
    variant: 'white-card',
  },
  {
    id: 'orthodontics',
    title: 'Invisalign® & Braces',
    shortDescription:
      'Precision alignment using clear aligner technology or modern fixed appliances for functional perfection.',
    description:
      'Precision alignment using clear aligner technology or modern fixed appliances for functional perfection.',
    slug: 'orthodontics-alignments',
    iconName: 'Activity',
    variant: 'white-card',
    imagePath: '/images/home/orthodontics.png',
  },
  {
    id: 'emergency-care',
    title: 'Emergency Care',
    shortDescription:
      'Rapid response for acute pain, trauma, or unexpected dental issues with priority scheduling for immediate relief.',
    description:
      'Rapid response for acute pain, trauma, or unexpected dental issues with priority scheduling for immediate relief.',
    slug: 'emergency-care',
    iconName: 'PhoneCall',
    variant: 'accent-pink-card',
    ctaLabel: 'Learn More',
  },
];
