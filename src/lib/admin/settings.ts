import { prisma } from '../db';

/**
 * Fetches the clinic settings singleton, including embedded opening hours list.
 */
export async function getClinicSettingsForAdmin() {
  const settings = await prisma.clinicSettings.findFirst();
  return settings;
}

interface UpdateSettingsPayload {
  address: string;
  phone: string;
  phoneNote?: string;
  email: string;
  emergencyPhone?: string;
  mapImageUrl?: string | null;
  mapDirectionsUrl?: string;
  openingHours: {
    label: string;
    hours: string;
    isEmergencyNote: boolean;
    isDimmed: boolean;
  }[];
}

/**
 * Updates the clinic settings singleton and updates embedded hours entries.
 */
export async function updateClinicSettings(payload: UpdateSettingsPayload) {
  const existing = await prisma.clinicSettings.findFirst();

  const formattedHours = payload.openingHours.map((oh, idx) => ({
    label: oh.label,
    hours: oh.hours,
    isEmergencyNote: Boolean(oh.isEmergencyNote),
    isDimmed: Boolean(oh.isDimmed),
    displayOrder: idx + 1,
  }));

  if (existing) {
    return prisma.clinicSettings.update({
      where: { id: existing.id },
      data: {
        address: payload.address,
        phone: payload.phone,
        phoneNote: payload.phoneNote || null,
        email: payload.email,
        emergencyPhone: payload.emergencyPhone || null,
        mapImageUrl: payload.mapImageUrl || null,
        mapDirectionsUrl: payload.mapDirectionsUrl || null,
        openingHours: formattedHours,
      },
    });
  }

  return prisma.clinicSettings.create({
    data: {
      address: payload.address,
      phone: payload.phone,
      phoneNote: payload.phoneNote || null,
      email: payload.email,
      emergencyPhone: payload.emergencyPhone || null,
      mapImageUrl: payload.mapImageUrl || null,
      mapDirectionsUrl: payload.mapDirectionsUrl || null,
      openingHours: formattedHours,
    },
  });
}
