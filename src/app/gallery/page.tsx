import type { Metadata } from 'next';
import React from 'react';
import GalleryHero from '@/components/sections/gallery/GalleryHero';
import GalleryGrid from '@/components/sections/gallery/GalleryGrid';
import GalleryCTA from '@/components/sections/gallery/GalleryCTA';
import { getGalleryItems } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Smile Gallery - Before & After Cases',
  description:
    'Witness the cosmetic smile makeovers, dental implants transformations, and orthodontic alignment cases completed at Dental Cosmetics & Implant Centre.',
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <GalleryHero />
      <GalleryGrid initialItems={items} />
      <GalleryCTA />
    </>
  );
}
