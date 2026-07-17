import prisma from '@/lib/prisma';
import { GalleryItem } from '@/types/gallery';
import { fallbackGalleryItems } from '@/data/gallery';

/**
 * Returns published gallery case items sorted by displayOrder.
 * Swapping backend persistence (like Postgres or remote clients) in the future
 * only requires updates to this single function context.
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const dbItems = await prisma.galleryItem.findMany({
      where: { status: 'published' },
      orderBy: { displayOrder: 'asc' },
    });

    if (dbItems.length > 0) {
      return dbItems.map((item) => ({
        id: item.id,
        variant: item.variant as GalleryItem['variant'],
        title: item.title,
        description: item.description,
        category: item.category as GalleryItem['category'],
        images: JSON.parse(item.imagesJson || '{}'),
        tags: JSON.parse(item.tagsJson || '[]'),
        isVerifiedPatient: item.isVerifiedPatient,
        featured: item.featured,
        status: item.status as GalleryItem['status'],
        displayOrder: item.displayOrder,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }));
    }
  } catch (error) {
    console.warn('Database fetch failed in getGalleryItems, falling back to static data:', error);
  }

  return fallbackGalleryItems;
}
