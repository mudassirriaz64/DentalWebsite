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
    featured: true,
    bullets: ['Custom Porcelain Veneers', 'Laser Teeth Whitening', 'Gum Contouring', 'Composite Bonding'],
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
    imagePath: '/images/home/dental-implants.png',
    featured: true,
    bullets: ['Single & Full Arch Implants', '3D Computer Guided Surgery', 'Bone Grafting & Augmentation'],
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
    featured: false,
    bullets: ['Comprehensive Examination', 'Ultrasonic Hygiene Cleaning', 'Oral Cancer Screening'],
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
    featured: true,
    bullets: ['Custom Clear Aligners', '3D Digital Simulation', 'Adult & Teen Orthodontics'],
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
    featured: false,
  },
];

import prisma from '@/lib/prisma';

export async function getServices(): Promise<Service[]> {
  try {
    const dbServices = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });
    if (dbServices.length > 0) {
      return dbServices.map((s) => ({
        id: s.id,
        title: s.title,
        shortDescription: s.shortDescription,
        description: s.description,
        slug: s.slug,
        iconName: s.iconName,
        imagePath: s.imagePath || undefined,
        variant: s.variant as any || undefined,
        ctaLabel: s.ctaLabel || undefined,
        bullets: JSON.parse(s.bulletsJson || '[]'),
        featured: (s as any).featured ?? false,
      }));
    }
  } catch (error) {
    console.warn('Database fetch failed in getServices, falling back to static data:', error);
  }
  return services;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const allServices = await getServices();
  return allServices.find((s) => s.slug === slug || s.id === slug) || null;
}

