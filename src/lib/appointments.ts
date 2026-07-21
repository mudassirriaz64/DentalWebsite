import prisma from '@/lib/prisma';
import { getDoctors } from '@/data/doctors';

export interface AppointmentInput {
  patientName: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  serviceId: string;
  doctorId?: string | null;
  preferredDate?: string | Date | null;
  preferredTime?: string | null;
  notes?: string | null;
}

export async function submitAppointment(data: AppointmentInput) {
  const preferredDate = data.preferredDate ? new Date(data.preferredDate) : null;

  // Look up Service for write-time snapshot
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
  });

  const doctorIdClean = data.doctorId && data.doctorId.trim().length > 0 ? data.doctorId : null;
  let doctorNameSnapshot: string | null = null;

  if (doctorIdClean) {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorIdClean },
    });
    doctorNameSnapshot = doctor ? doctor.name : null;
  }

  return prisma.appointment.create({
    data: {
      patientName: data.patientName,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      serviceId: data.serviceId,
      serviceTitle: service ? service.title : 'General Consultation',
      doctorId: doctorIdClean,
      doctorName: doctorNameSnapshot,
      preferredDate: preferredDate && !isNaN(preferredDate.getTime()) ? preferredDate : null,
      preferredTime: data.preferredTime || null,
      notes: data.notes || null,
      status: 'pending',
      isRead: false,
    },
    include: {
      service: true,
      doctor: true,
    },
  });
}

export async function getBookableDoctors() {
  return getDoctors();
}
