import prisma from '@/lib/prisma';

export async function getFounderSpotlight() {
  try {
    const spotlight = await prisma.founderSpotlight.findFirst();
    return spotlight;
  } catch (error) {
    console.warn('Database fetch failed in getFounderSpotlight:', error);
    return null;
  }
}
