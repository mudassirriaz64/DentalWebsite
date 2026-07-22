import { prisma } from './db';
import { ReviewInput } from '@/types/reviews';

/**
 * Renders approved reviews for public pages.
 * Sorts featured items first, then displayOrder, then creation date desc.
 */
export async function getApprovedReviews({
  category,
  featured,
  page = 1,
  pageSize = 6,
}: {
  category?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: 'approved',
        ...(category && category !== 'All Reviews' ? { category } : {}),
        ...(featured !== undefined ? { featured } : {}),
      },
      orderBy: [
        { featured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('getApprovedReviews error:', error);
    return [];
  }
}

/**
 * Renders Site Stats for Reviews page.
 */
export async function getReviewStats() {
  try {
    const stats = await prisma.siteStat.findMany({
      where: { page: 'reviews' },
      orderBy: { displayOrder: 'asc' },
    });

    return stats.map((s) => ({
      ...s,
      updatedAt: s.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('getReviewStats error:', error);
    return [];
  }
}

/**
 * Creates a public submission log.
 * Public reviews are ALWAYS pending approval.
 */
export async function submitReview(data: ReviewInput) {
  return prisma.review.create({
    data: {
      patientName: data.patientName,
      rating: data.rating,
      title: data.title,
      body: data.body,
      category: data.category,
      treatmentType: data.treatmentType || null,
      isVerifiedPatient: data.isVerifiedPatient ?? false,
      status: 'pending', // Moderation enforce
      featured: false,
    },
  });
}

/**
 * Renders Site Stats for a specific page.
 */
export async function getSiteStats(page: string) {
  try {
    const stats = await prisma.siteStat.findMany({
      where: { page },
      orderBy: { displayOrder: 'asc' },
    });

    return stats.map((s) => ({
      ...s,
      id: s.id,
      updatedAt: s.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error(`getSiteStats error for page ${page}:`, error);
    return [];
  }
}

/**
 * Returns a live count of approved reviews.
 */
export async function getApprovedReviewsCount() {
  try {
    return await prisma.review.count({
      where: { status: 'approved' },
    });
  } catch (error) {
    console.error('getApprovedReviewsCount error:', error);
    return 0;
  }
}
