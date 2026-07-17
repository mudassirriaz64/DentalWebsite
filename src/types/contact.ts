export type SubmissionStatus = 'new' | 'contacted' | 'scheduled' | 'closed';

export interface ContactSubmission {
  id: string;
  fullName: string;
  serviceInterest: string;
  email: string;
  phone: string;
  message: string | null;
  status: SubmissionStatus;
  isRead: boolean;
  internalNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormInput {
  fullName: string;
  serviceInterest: string;
  email: string;
  phone: string;
  message?: string;
}
