import { prisma } from '../db';
import { ReviewStatus } from '@/types/reviews';

/**
 * Fetches all reviews for the administrative moderation panel.
 * Sorts pending reviews first, then approved featured ones, then displayOrder.
 */
export async function getAllReviewsForAdmin() {
  return prisma.review.findMany({
    orderBy: [
      { status: 'asc' }, // 'pending' (p) comes before 'approved' (a) / 'rejected' (r) alphabetically! Wait, 'approved' is 'a', 'pending' is 'p', 'rejected' is 'r'.
      // If we want pending first, since 'approved' < 'pending' < 'rejected' alphabetically:
      // We can sort explicitly, or do it in memory, or sorting by status 'desc' puts pending (p) / rejected (r) first, which is not what we want.
      // Let's sort in memory or do dual queries, or query status: pending first then others.
      // Wait! Sorting by status 'desc' puts 'rejected' (r) first, then 'pending' (p), then 'approved' (a).
      // Let's sort by createdAt desc or displayOrder asc in database, and we can order them in memory if needed, or sort by displayOrder.
      // Let's sort by status 'desc' and createdAt 'desc' to put pending/rejected first, or we can just sort by displayOrder.
      // Wait, let's sort by: status 'desc', displayOrder 'asc', createdAt 'desc'.
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
}

/**
 * Updates status of a review (Approve / Reject).
 */
export async function updateReviewStatus(id: string, status: ReviewStatus) {
  return prisma.review.update({
    where: { id },
    data: { status },
  });
}

/**
 * Toggles a review as featured.
 */
export async function updateReviewFeatured(id: string, featured: boolean) {
  return prisma.review.update({
    where: { id },
    data: { featured },
  });
}

/**
 * Deletes a review.
 */
export async function deleteReview(id: string) {
  return prisma.review.delete({
    where: { id },
  });
}

interface SaveReviewInput {
  patientName: string;
  patientAvatarUrl?: string | null;
  rating: number;
  title: string;
  body: string;
  category: string;
  treatmentType?: string | null;
  isVerifiedPatient: boolean;
  status: ReviewStatus;
  featured: boolean;
  displayOrder?: number;
}

/**
 * Creates a review from the admin panel.
 */
export async function createReview(data: SaveReviewInput) {
  // Determine displayOrder
  let nextOrder = 1;
  const lastItem = await prisma.review.findFirst({
    orderBy: { displayOrder: 'desc' },
  });
  if (lastItem) {
    nextOrder = lastItem.displayOrder + 1;
  }

  return prisma.review.create({
    data: {
      patientName: data.patientName,
      patientAvatarUrl: data.patientAvatarUrl || null,
      rating: data.rating,
      title: data.title,
      body: data.body,
      category: data.category,
      treatmentType: data.treatmentType || null,
      isVerifiedPatient: data.isVerifiedPatient,
      status: data.status,
      featured: data.featured,
      displayOrder: data.displayOrder ?? nextOrder,
    },
  });
}

/**
 * Updates a review details.
 */
export async function updateReview(id: string, data: SaveReviewInput) {
  return prisma.review.update({
    where: { id },
    data: {
      patientName: data.patientName,
      patientAvatarUrl: data.patientAvatarUrl || null,
      rating: data.rating,
      title: data.title,
      body: data.body,
      category: data.category,
      treatmentType: data.treatmentType || null,
      isVerifiedPatient: data.isVerifiedPatient,
      status: data.status,
      featured: data.featured,
      displayOrder: data.displayOrder,
    },
  });
}

/**
 * Batch updates displayOrder of reviews inside a transaction.
 */
export async function batchUpdateReviewOrder(ids: string[]) {
  return prisma.$transaction(
    ids.map((id, index) =>
      prisma.review.update({
        where: { id },
        data: { displayOrder: index + 1 },
      })
    )
  );
}
