import { prisma } from '../db';
import { SubmissionStatus } from '@/types/contact';

/**
 * Fetches all contact submissions sorted by creation date (newest first).
 */
export async function getAllSubmissions() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Updates an individual submission status.
 */
export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  return prisma.contactSubmission.update({
    where: { id },
    data: { status },
  });
}

/**
 * Updates an individual submission internal note.
 */
export async function updateSubmissionNote(id: string, note: string) {
  return prisma.contactSubmission.update({
    where: { id },
    data: { internalNote: note },
  });
}

/**
 * Marks an individual submission as read.
 */
export async function markSubmissionRead(id: string) {
  return prisma.contactSubmission.update({
    where: { id },
    data: { isRead: true },
  });
}

/**
 * Deletes an individual submission.
 */
export async function deleteSubmission(id: string) {
  return prisma.contactSubmission.delete({
    where: { id },
  });
}

/**
 * Performs bulk updates on multiple contact submissions.
 */
export async function bulkUpdateSubmissions(ids: string[], payload: { isRead?: boolean; status?: SubmissionStatus }) {
  const data: any = {};
  if (payload.isRead !== undefined) data.isRead = payload.isRead;
  if (payload.status !== undefined) data.status = payload.status;

  return prisma.contactSubmission.updateMany({
    where: { id: { in: ids } },
    data,
  });
}

/**
 * Performs bulk deletes on multiple contact submissions.
 */
export async function bulkDeleteSubmissions(ids: string[]) {
  return prisma.contactSubmission.deleteMany({
    where: { id: { in: ids } },
  });
}
