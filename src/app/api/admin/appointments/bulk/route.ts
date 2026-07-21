import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const bulkSchema = z.object({
  ids: z.array(z.string()).min(1, 'Select at least one appointment'),
  action: z.enum(['markRead', 'updateStatus', 'delete']),
  status: z.enum(['pending', 'confirmed', 'rescheduled', 'cancelled', 'completed']).optional(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = bulkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { ids, action, status } = result.data;

    if (action === 'markRead') {
      await prisma.appointment.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
      });
    } else if (action === 'updateStatus' && status) {
      await prisma.appointment.updateMany({
        where: { id: { in: ids } },
        data: { status },
      });
    } else if (action === 'delete') {
      await prisma.appointment.deleteMany({
        where: { id: { in: ids } },
      });
    }

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error('Bulk appointment action error:', error);
    return NextResponse.json({ error: 'Failed to process bulk action' }, { status: 500 });
  }
}
