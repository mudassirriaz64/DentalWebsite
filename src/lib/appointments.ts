import prisma from '@/lib/prisma';
import { getDoctors } from '@/data/doctors';

export interface AppointmentInput {
  patientName: string;
  email: string;
  phone: string;
  serviceId: string;
  doctorId?: string | null;
  preferredDate?: string | Date | null;
  preferredTime?: string | null;
  notes?: string | null;
}

export async function submitAppointment(data: AppointmentInput) {
  const preferredDate = data.preferredDate ? new Date(data.preferredDate) : null;

  return prisma.appointment.create({
    data: {
      patientName: data.patientName,
      email: data.email,
      phone: data.phone,
      serviceId: data.serviceId,
      doctorId: data.doctorId && data.doctorId.trim().length > 0 ? data.doctorId : null,
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
