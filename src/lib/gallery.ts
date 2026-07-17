import { prisma } from './db';
import { GalleryItem } from '@/types/gallery';
import { fallbackGalleryItems } from '@/data/gallery';

/**
 * Returns published gallery items, mapping database fields to GalleryItem types.
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const dbItems = await prisma.galleryItem.findMany({
      where: { status: 'published' },
      orderBy: { displayOrder: 'asc' },
    });

    if (dbItems.length > 0) {
      return dbItems.map((item) => {
        // Map database columns to composite structures
        const images: GalleryItem['images'] = {};
        
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
          variant: item.variant as GalleryItem['variant'],
          title: item.title,
          description: item.description,
          category: item.category as GalleryItem['category'],
          images,
          tags,
          isVerifiedPatient: item.isVerifiedPatient,
          featured: item.featured,
          status: item.status as GalleryItem['status'],
          displayOrder: item.displayOrder,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        };
      });
    }
  } catch (error) {
    console.error('getGalleryItems database fetch failed, using fallback:', error);
  }

  return fallbackGalleryItems;
}
