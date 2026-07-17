import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateSubmissionStatus, updateSubmissionNote, markSubmissionRead, deleteSubmission } from '@/lib/admin/submissions';
import { getSession } from '@/lib/auth';

const updateSchema = z.object({
  status: z.enum(['new', 'contacted', 'scheduled', 'closed']).optional(),
  internalNote: z.string().optional(),
  isRead: z.boolean().optional(),
});

type Params = Promise<{ id: string }>;

export async function PATCH(request: Request, segmentData: { params: Params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await segmentData.params;

  try {
    const body = await request.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { status, internalNote, isRead } = result.data;
    let updated;

    if (status !== undefined) {
      updated = await updateSubmissionStatus(id, status);
    }
    if (internalNote !== undefined) {
      updated = await updateSubmissionNote(id, internalNote);
    }
    if (isRead === true) {
      updated = await markSubmissionRead(id);
    }

    return NextResponse.json(updated || { success: true });
  } catch (error) {
    console.error('API PATCH submission error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(request: Request, segmentData: { params: Params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await segmentData.params;

  try {
    await deleteSubmission(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API DELETE submission error:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
