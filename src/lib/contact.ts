import { prisma } from './db';
import { ContactFormInput } from '@/types/contact';

/**
 * Submits a public query query contact submission to SQLite.
 */
export async function submitContactForm(data: ContactFormInput) {
  return prisma.contactSubmission.create({
    data: {
      fullName: data.fullName,
      serviceInterest: data.serviceInterest,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      message: data.message || '',
      status: 'new',
      isRead: false,
    },
  });
}

/**
 * Queries the singleton ClinicSettings record including related opening hours list.
 * Fallbacks are provided if settings have not been seeded yet.
 */
export async function getClinicSettings() {
  try {
    const settings = await prisma.clinicSettings.findFirst({
      include: {
        openingHours: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (settings) {
      return {
        ...settings,
        updatedAt: settings.updatedAt.toISOString(),
      };
    }
  } catch (error) {
    console.warn('getClinicSettings fetch failed, using fallback settings:', (error as any)?.message || error);
  }

  // Seeding fallback to maintain layout rendering
  return {
    id: 'default-settings',
    address: '4517 Washington Ave. Manchester, Kentucky 39495',
    phone: '(502) 555-0107',
    phoneNote: 'Mon-Fri, 9am - 5pm',
    email: 'office@dentalcosmetic.com',
    emergencyPhone: '(502) 999-0000',
    mapImageUrl: null,
    mapDirectionsUrl: 'https://maps.google.com',
    openingHours: [
      { id: '1', label: 'Mon - Thu', hours: '09:00 - 18:00', isEmergencyNote: false, isDimmed: false, displayOrder: 1 },
      { id: '2', label: 'Friday', hours: '09:00 - 16:00', isEmergencyNote: false, isDimmed: false, displayOrder: 2 },
      { id: '3', label: 'Saturday', hours: 'Emergency Only', isEmergencyNote: true, isDimmed: false, displayOrder: 3 },
      { id: '4', label: 'Sunday', hours: 'Closed', isEmergencyNote: false, isDimmed: true, displayOrder: 4 },
    ],
    updatedAt: new Date().toISOString(),
  };
}
