import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStatsForAdmin, updateStats } from '@/lib/admin/stats';
import { getSession } from '@/lib/auth';

const updateStatsSchema = z.object({
  stats: z.array(
    z.object({
      label: z.string().min(1, 'Label name is required').max(100),
      value: z.string().min(1, 'Stat value is required').max(50),
    })
  ),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await getStatsForAdmin();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API GET stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch site statistics' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = updateStatsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    await updateStats(result.data.stats);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API PATCH stats error:', error);
    return NextResponse.json({ error: 'Failed to save site statistics' }, { status: 500 });
  }
}
