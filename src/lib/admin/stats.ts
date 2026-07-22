import { prisma } from '../db';

/**
 * Fetches reviews site stats sorted by displayOrder.
 */
export async function getStatsForAdmin(page: string = 'reviews') {
  return prisma.siteStat.findMany({
    where: { page },
    orderBy: { displayOrder: 'asc' },
  });
}

interface StatPayload {
  label: string;
  value: string;
}

/**
 * Updates site stats via transactional delete-and-insert.
 */
export async function updateStats(payload: StatPayload[], page: string = 'reviews') {
  return prisma.$transaction(async (tx) => {
    // 1. Delete existing stats for the page
    await tx.siteStat.deleteMany({
      where: { page },
    });

    // 2. Re-insert new stats items
    return tx.siteStat.createMany({
      data: payload.map((s, idx) => ({
        page,
        label: s.label,
        value: s.value,
        displayOrder: idx + 1,
      })),
    });
  });
}
