import { NextResponse } from 'next/server';
import { getFounderSpotlight } from '@/data/founderSpotlight';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const spotlight = await getFounderSpotlight();
    return NextResponse.json(spotlight);
  } catch (error) {
    console.error('Fetch founder spotlight error:', error);
    return NextResponse.json(null);
  }
}
