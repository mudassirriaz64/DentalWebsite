import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClinicSettingsForAdmin, updateClinicSettings } from '@/lib/admin/settings';
import { getSession } from '@/lib/auth';

const updateSettingsSchema = z.object({
  address: z.string().min(1, 'Address is required').max(200),
  phone: z.string().min(1, 'Phone is required').max(30),
  phoneNote: z.string().max(50).optional(),
  email: z.string().email('Please enter a valid email address').max(100),
  emergencyPhone: z.string().max(30).optional(),
  mapImageUrl: z.string().optional().or(z.literal('')).nullable(),
  mapDirectionsUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  openingHours: z.array(
    z.object({
      label: z.string().min(1, 'Day label is required').max(50),
      hours: z.string().min(1, 'Hours details are required').max(50),
      isEmergencyNote: z.boolean(),
      isDimmed: z.boolean(),
    })
  ),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getClinicSettingsForAdmin();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('API GET settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = updateSettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const updated = await updateClinicSettings(result.data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('API PATCH settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
