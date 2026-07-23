import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { username: session.username },
      select: { username: true, email: true },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error('Error fetching account settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, newPassword } = body;

    const dataToUpdate: any = {};
    if (email !== undefined) {
      dataToUpdate.email = email;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: 'No updates provided' });
    }

    await prisma.adminUser.update({
      where: { username: session.username },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error updating account settings:', error);
      return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
    }
}
