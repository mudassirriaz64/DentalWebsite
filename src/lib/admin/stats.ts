import { prisma } from '../db';

/**
 * Fetches reviews site stats sorted by displayOrder.
 */
export async function getStatsForAdmin() {
  return prisma.siteStat.findMany({
    where: { page: 'reviews' },
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
export async function updateStats(payload: StatPayload[]) {
  return prisma.$transaction(async (tx) => {
    // 1. Delete existing reviews stats
    await tx.siteStat.deleteMany({
      where: { page: 'reviews' },
    });

    // 2. Re-insert new stats items
    return tx.siteStat.createMany({
      data: payload.map((s, idx) => ({
        page: 'reviews',
        label: s.label,
        value: s.value,
        displayOrder: idx + 1,
      })),
    });
  });
}
