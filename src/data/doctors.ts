import { Doctor } from '@/types';

export const doctors: Doctor[] = [
  // Visionaries (About Page)
  {
    id: 'doc-elena-sterling',
    name: 'Dr. Elena Sterling',
    role: 'visionary',
    title: 'Founder & Lead Cosmetic Surgeon',
    bio: 'Specializing in full-mouth rehabilitation and smile design with over 25 years of experience.',
    imagePath: '/images/home/doctor-elena.png',
  },
  {
    id: 'doc-marcus-vance',
    name: 'Dr. Marcus Vance',
    role: 'visionary',
    title: 'Chief Implantologist',
    bio: 'A pioneer in robotic-assisted dental implants and bone grafting procedures.',
    imagePath: '/images/home/doctor-marcus.png',
  },
  {
    id: 'doc-sarah-chen',
    name: 'Dr. Sarah Chen',
    role: 'visionary',
    title: 'Orthodontic Specialist',
    bio: 'Expert in invisible alignment systems and adult aesthetic orthodontics.',
    imagePath: '/images/home/doctor-sarah.png',
  },

  // Department Heads (Team Page)
  {
    id: 'doc-mark-wright',
    name: 'Dr. Mark Wright',
    role: 'department-head',
    title: 'Head of Implantology',
    bio: 'Expert in reconstructive surgery and complex implant positioning utilizing advanced 3D diagnostic guides.',
    imagePath: '/images/home/doctor-marcus.png',
  },
  {
    id: 'doc-jane-cooper',
    name: 'Dr. Jane Cooper',
    role: 'department-head',
    title: 'Head of Cosmetic Dentistry',
    bio: 'Renowned cosmetic surgeon specializing in porcelain veneers, bonding, and full-smile designs.',
    imagePath: '/images/home/doctor-elena.png',
  },
  {
    id: 'doc-emily-wilson',
    name: 'Dr. Emily Wilson',
    role: 'department-head',
    title: 'Head of Orthodontics',
    bio: 'Leader in digital orthodontic alignments, Invisalign protocols, and biomechanical optimization.',
    imagePath: '/images/home/doctor-sarah.png',
  },

  // Core Team (Team Page)
  {
    id: 'doc-theresa-webb',
    name: 'Dr. Theresa Webb',
    role: 'core-team',
    title: 'Periodontist',
    bio: 'Specializing in soft tissue grafts, bone regeneration, and the treatment of periodontal diseases.',
    imagePath: '/images/home/doctor-marcus.png',
  },
  {
    id: 'doc-brooklyn-simmons',
    name: 'Dr. Brooklyn Simmons',
    role: 'core-team',
    title: 'Oral Surgeon',
    bio: 'Performing wisdom teeth extractions, maxillofacial procedures, and emergency trauma operations.',
    imagePath: '/images/home/doctor-elena.png',
  },
  {
    id: 'doc-adelaida-smith',
    name: 'Dr. Adelaida Smith',
    role: 'core-team',
    title: 'Endodontist',
    bio: 'Specialist in microscopic root canal therapies, pulpal diagnostics, and biological tooth preservation.',
    imagePath: '/images/home/doctor-sarah.png',
  },
];

import prisma from '@/lib/prisma';

export async function getDoctorsByRole(role: Doctor['role']): Promise<Doctor[]> {
  try {
    const dbDoctors = await prisma.doctor.findMany({
      where: { role },
      orderBy: { createdAt: 'asc' },
    });

    if (dbDoctors.length > 0) {
      return dbDoctors.map((doc) => ({
        id: doc.id,
        name: doc.name,
        role: doc.role as Doctor['role'],
        title: doc.title,
        bio: doc.bio,
        imagePath: doc.imagePath,
        specialties: JSON.parse(doc.specialtiesJson || '[]'),
        education: JSON.parse(doc.educationJson || '[]'),
      }));
    }
  } catch (error) {
    console.warn('Database fetch failed in getDoctorsByRole, falling back to static data:', error);
  }

  return doctors.filter((doc) => doc.role === role);
}
