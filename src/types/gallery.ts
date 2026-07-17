export type GalleryCardVariant =
  | 'comparison' // before/after split image
  | 'vertical' // tall image + overlay text
  | 'square' // image + badge + content below
  | 'wideSplit' // half image / half color block
  | 'small'; // compact image + content card

export type GalleryCategory = 'Veneers' | 'Implants' | 'Invisalign' | 'Whitening' | 'Full Mouth';

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Veneers',
  'Implants',
  'Invisalign',
  'Whitening',
  'Full Mouth',
];

export interface GalleryImage {
  publicId: string; // today: local path like "gallery/before-1.jpg"
  // later: real Cloudinary public_id like "dental/case-14-before"
  url: string; // today: local path under /public/images/gallery/
  // later: resolved Cloudinary delivery URL
  altText: string; // required for accessibility
}

export interface GalleryItem {
  id: string;
  variant: GalleryCardVariant;
  title: string;
  description: string;
  category: GalleryCategory;
  images: {
    before?: GalleryImage;
    after?: GalleryImage;
    main?: GalleryImage;
  };
  tags?: string[];
  isVerifiedPatient?: boolean;
  featured?: boolean;
  status: 'published' | 'draft';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
