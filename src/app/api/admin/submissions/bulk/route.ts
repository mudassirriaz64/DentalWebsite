import { NextResponse } from 'next/server';
import { z } from 'zod';
import { bulkUpdateSubmissions, bulkDeleteSubmissions } from '@/lib/admin/submissions';
import { getSession } from '@/lib/auth';

const bulkUpdateSchema = z.object({
  ids: z.array(z.string().min(1)),
  status: z.enum(['new', 'contacted', 'scheduled', 'closed']).optional(),
  isRead: z.boolean().optional(),
});

const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = bulkUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { ids, status, isRead } = result.data;
    await bulkUpdateSubmissions(ids, { status, isRead });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API bulk patch submissions error:', error);
    return NextResponse.json({ error: 'Failed to update submissions in bulk' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = bulkDeleteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { ids } = result.data;
    await bulkDeleteSubmissions(ids);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API bulk delete submissions error:', error);
    return NextResponse.json({ error: 'Failed to delete submissions in bulk' }, { status: 500 });
  }
}
