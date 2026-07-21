import { NextResponse } from 'next/server';
import { getDoctors } from '@/data/doctors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const doctors = await getDoctors();
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Fetch doctors error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
