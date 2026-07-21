export interface OpeningHoursEntry {
  id?: string;
  label: string;
  hours: string;
  isEmergencyNote: boolean;
  isDimmed: boolean;
  displayOrder: number;
  clinicSettingsId?: string;
}

export interface ClinicSettings {
  id: string;
  address: string;
  phone: string;
  phoneNote: string | null;
  email: string;
  emergencyPhone: string | null;
  mapImageUrl: string | null;
  mapDirectionsUrl: string | null;
  openingHours?: OpeningHoursEntry[];
  updatedAt: string;
}
