import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [unreadAppointments, unreadSubmissions, pendingReviews] = await Promise.all([
      prisma.appointment.count({ where: { isRead: false } }),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.review.count({ where: { status: 'pending' } }),
    ]);

    return NextResponse.json({
      unreadAppointments,
      unreadSubmissions,
      pendingReviews,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
