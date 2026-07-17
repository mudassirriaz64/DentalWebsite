import { NextResponse } from 'next/server';
import { z } from 'zod';
import { batchUpdateReviewOrder } from '@/lib/admin/reviews';
import { getSession } from '@/lib/auth';

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = reorderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    await batchUpdateReviewOrder(result.data.ids);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API PATCH reorder reviews error:', error);
    return NextResponse.json({ error: 'Failed to reorder reviews' }, { status: 500 });
  }
}
