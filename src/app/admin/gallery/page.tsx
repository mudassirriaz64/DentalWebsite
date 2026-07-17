import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import GalleryAdminContent from '@/components/sections/admin/GalleryAdminContent';

export const metadata = {
  title: 'Gallery Management - Admin Panel',
  description: 'Manage clinic case transformations, layouts, re-ordering, and visibility.',
};

export default async function AdminGalleryPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch all gallery items sorted by displayOrder
  let items: any[] = [];
  try {
    const dbItems = await prisma.galleryItem.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    items = dbItems.map((item) => {
      const images: any = {};
      if (item.beforeImageUrl) {
        images.before = {
          publicId: item.beforeImageId || '',
          url: item.beforeImageUrl,
          altText: item.beforeImageAlt || '',
        };
      }
      if (item.afterImageUrl) {
        images.after = {
          publicId: item.afterImageId || '',
          url: item.afterImageUrl,
          altText: item.afterImageAlt || '',
        };
      }
      if (item.mainImageUrl) {
        images.main = {
          publicId: item.mainImageId || '',
          url: item.mainImageUrl,
          altText: item.mainImageAlt || '',
        };
      }

      let tags: string[] = [];
      if (item.tags) {
        try {
          tags = JSON.parse(item.tags);
        } catch {
          tags = item.tags.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }

      return {
        id: item.id,
        variant: item.variant,
        title: item.title,
        description: item.description,
        category: item.category,
        images,
        tags,
        isVerifiedPatient: item.isVerifiedPatient,
        featured: item.featured,
        status: item.status,
        displayOrder: item.displayOrder,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    });
  } catch (err) {
    console.error('Error fetching admin gallery cases:', err);
  }

  return (
    <Suspense fallback={<div className="p-6 text-slate-500 font-sans">Loading gallery workspace...</div>}>
      <GalleryAdminContent initialItems={items} />
    </Suspense>
  );
}
