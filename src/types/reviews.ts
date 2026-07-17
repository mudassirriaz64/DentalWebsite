export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  patientName: string;
  patientAvatarUrl: string | null;
  rating: number; // 1-5
  title: string;
  body: string;
  category: string; // "Implants" | "Cosmetic" | "General Care"
  treatmentType: string | null;
  isVerifiedPatient: boolean;
  status: ReviewStatus;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewInput {
  patientName: string;
  rating: number;
  title: string;
  body: string;
  category: string;
  treatmentType?: string;
  isVerifiedPatient?: boolean;
}

export interface SiteStat {
  id: string;
  page: string;
  label: string;
  value: string;
  displayOrder: number;
  updatedAt: string;
}
