import { NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/admin/submissions';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const submissions = await getAllSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('API GET submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
  }
}
