import { Doctor } from '@/types';
import prisma from '@/lib/prisma';

export const doctors: Doctor[] = [
  {
    id: 'doc-elena-sterling',
    name: 'Dr. Elena Sterling',
    title: 'Lead Cosmetic Surgeon',
    bio: 'Specializing in full-mouth rehabilitation and smile design with over 25 years of experience.',
    imagePath: '/images/home/doctor-elena.png',
    displayOrder: 1,
  },
  {
    id: 'doc-marcus-vance',
    name: 'Dr. Marcus Vance',
    title: 'Chief Implantologist',
    bio: 'A pioneer in robotic-assisted dental implants and bone grafting procedures.',
    imagePath: '/images/home/doctor-marcus.png',
    displayOrder: 2,
  },
  {
    id: 'doc-sarah-chen',
    name: 'Dr. Sarah Chen',
    title: 'Orthodontic Specialist',
    bio: 'Expert in invisible alignment systems and adult aesthetic orthodontics.',
    imagePath: '/images/home/doctor-sarah.png',
    displayOrder: 3,
  },
  {
    id: 'doc-mark-wright',
    name: 'Dr. Mark Wright',
    title: 'Implantology Specialist',
    bio: 'Expert in reconstructive surgery and complex implant positioning utilizing advanced 3D diagnostic guides.',
    imagePath: '/images/home/doctor-marcus.png',
    displayOrder: 4,
  },
  {
    id: 'doc-jane-cooper',
    name: 'Dr. Jane Cooper',
    title: 'Lead Cosmetic Surgeon',
    bio: 'Renowned cosmetic surgeon specializing in porcelain veneers, bonding, and full-smile designs.',
    imagePath: '/images/home/doctor-elena.png',
    displayOrder: 5,
  },
  {
    id: 'doc-emily-wilson',
    name: 'Dr. Emily Wilson',
    title: 'Orthodontic Specialist',
    bio: 'Leader in digital orthodontic alignments, Invisalign protocols, and biomechanical optimization.',
    imagePath: '/images/home/doctor-sarah.png',
    displayOrder: 6,
  },
  {
    id: 'doc-theresa-webb',
    name: 'Dr. Theresa Webb',
    title: 'Periodontist',
    bio: 'Specializing in soft tissue grafts, bone regeneration, and the treatment of periodontal diseases.',
    imagePath: '/images/home/doctor-marcus.png',
    displayOrder: 7,
  },
  {
    id: 'doc-brooklyn-simmons',
    name: 'Dr. Brooklyn Simmons',
    title: 'Oral Surgeon',
    bio: 'Performing wisdom teeth extractions, maxillofacial procedures, and emergency trauma operations.',
    imagePath: '/images/home/doctor-elena.png',
    displayOrder: 8,
  },
  {
    id: 'doc-adelaida-smith',
    name: 'Dr. Adelaida Smith',
    title: 'Endodontist',
    bio: 'Specialist in microscopic root canal therapies, pulpal diagnostics, and biological tooth preservation.',
    imagePath: '/images/home/doctor-sarah.png',
    displayOrder: 9,
  },
];

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const dbDoctors = await prisma.doctor.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    if (dbDoctors.length > 0) {
      return dbDoctors.map((doc) => ({
        id: doc.id,
        name: doc.name,
        title: doc.title,
        bio: doc.bio,
        imagePath: doc.imagePath,
        specialties: JSON.parse(doc.specialtiesJson || '[]'),
        education: JSON.parse(doc.educationJson || '[]'),
        displayOrder: doc.displayOrder,
      }));
    }
  } catch (error) {
    console.warn('Database fetch failed in getDoctors, falling back to static data:', error);
  }

  return doctors;
}

export const getAllDoctors = getDoctors;
