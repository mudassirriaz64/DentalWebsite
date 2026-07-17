import { prisma } from '../db';

const SETTINGS_ID = 'clinic-settings-singleton';

/**
 * Fetches the clinic settings singleton, including related opening hours list.
 */
export async function getClinicSettingsForAdmin() {
  return prisma.clinicSettings.findUnique({
    where: { id: SETTINGS_ID },
    include: {
      openingHours: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });
}

interface UpdateSettingsPayload {
  address: string;
  phone: string;
  phoneNote?: string;
  email: string;
  emergencyPhone?: string;
  mapDirectionsUrl?: string;
  openingHours: {
    label: string;
    hours: string;
    isEmergencyNote: boolean;
    isDimmed: boolean;
  }[];
}

/**
 * Updates the clinic settings singleton and performs a batch replace of hours entries.
 */
export async function updateClinicSettings(payload: UpdateSettingsPayload) {
  // Use a transaction to ensure database consistency
  return prisma.$transaction(async (tx) => {
    // 1. Delete all existing opening hours entries for the settings singleton
    await tx.openingHoursEntry.deleteMany({
      where: { clinicSettingsId: SETTINGS_ID },
    });

    // 2. Update settings details and recreate hours lists
    return tx.clinicSettings.update({
      where: { id: SETTINGS_ID },
      data: {
        address: payload.address,
        phone: payload.phone,
        phoneNote: payload.phoneNote || null,
        email: payload.email,
        emergencyPhone: payload.emergencyPhone || null,
        mapDirectionsUrl: payload.mapDirectionsUrl || null,
        openingHours: {
          create: payload.openingHours.map((oh, idx) => ({
            label: oh.label,
            hours: oh.hours,
            isEmergencyNote: oh.isEmergencyNote,
            isDimmed: oh.isDimmed,
            displayOrder: idx + 1,
          })),
        },
      },
      include: {
        openingHours: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  });
}
