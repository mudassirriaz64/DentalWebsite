const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('adminpassword123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
    },
  });
  console.log('Admin user seeded:', admin.username);

  // 2. Seed Services
  const servicesData = [
    {
      title: 'Cosmetic Artistry',
      shortDescription:
        'Transform your appearance with bespoke veneers, professional whitening, and gum contouring designed for biological harmony.',
      description:
        'Transform your appearance with bespoke veneers, professional whitening, and gum contouring designed for biological harmony.',
      slug: 'cosmetic-artistry',
      iconName: 'Sparkles',
      variant: 'large-image-card',
      imagePath: '/images/home/cosmetic-smile.png',
      bulletsJson: JSON.stringify([
        'Custom Porcelain Veneers',
        'Professional Teeth Whitening',
        'Gum Contouring',
        'Composite Bonding',
      ]),
    },
    {
      title: 'Dental Implants',
      shortDescription:
        'Permanent restorative solutions using titanium or ceramic posts to replace missing teeth with unmatched stability and natural aesthetics.',
      description:
        'Permanent restorative solutions using titanium or ceramic posts to replace missing teeth with unmatched stability and natural aesthetics.',
      slug: 'dental-implants',
      iconName: 'Shield',
      variant: 'dark-teal-card',
      ctaLabel: 'Learn More',
      imagePath: '/images/home/dental-implants.png',
      bulletsJson: JSON.stringify([
        'Single Tooth Replacement',
        'Multiple Implant Bridges',
        'All-on-4 Restoration',
        'Computer Guided Surgery',
      ]),
    },
    {
      title: 'Preventive Care',
      shortDescription:
        'Advanced diagnostics, regular hygiene therapy, and protective treatments to ensure long-term oral stability.',
      description:
        'Advanced diagnostics, regular hygiene therapy, and protective treatments to ensure long-term oral stability.',
      slug: 'preventive-care',
      iconName: 'CheckSquare',
      variant: 'white-card',
      bulletsJson: JSON.stringify([
        'Hygiene & Cleaning',
        'Digital X-Rays',
        'Oral Cancer Screening',
        'Fluoride Protection',
      ]),
    },
    {
      title: 'Invisalign® & Braces',
      shortDescription:
        'Precision alignment using clear aligner technology or modern fixed appliances for functional perfection.',
      description:
        'Precision alignment using clear aligner technology or modern fixed appliances for functional perfection.',
      slug: 'orthodontics-alignments',
      iconName: 'Activity',
      variant: 'white-card',
      imagePath: '/images/home/orthodontics.png',
      bulletsJson: JSON.stringify([
        'Invisalign Clear Aligners',
        'Aesthetic Ceramic Braces',
        'Early Phase Orthodontics',
        'Retention Systems',
      ]),
    },
    {
      title: 'Emergency Care',
      shortDescription:
        'Rapid response for acute pain, trauma, or unexpected dental issues with priority scheduling for immediate relief.',
      description:
        'Rapid response for acute pain, trauma, or unexpected dental issues with priority scheduling for immediate relief.',
      slug: 'emergency-care',
      iconName: 'PhoneCall',
      variant: 'accent-pink-card',
      ctaLabel: 'Learn More',
      bulletsJson: JSON.stringify([
        'Acute Pain Relief',
        'Tooth Re-implantation',
        'Temporary Crown Repair',
        'Abscess Drainage',
      ]),
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log('Services seeded.');

  // 3. Seed Doctors
  const doctorsData = [
    {
      name: 'Dr. Elena Sterling',
      role: 'visionary',
      title: 'Founder & Lead Cosmetic Surgeon',
      bio: 'Specializing in full-mouth rehabilitation and smile design with over 25 years of experience.',
      imagePath: '/images/home/doctor-elena.png',
      specialtiesJson: JSON.stringify([
        'Full Mouth Rehabilitation',
        'Porcelain Veneers',
        'Sedation Dentistry',
      ]),
      educationJson: JSON.stringify(['DDS - Columbia University', 'Fellowship - AACD']),
    },
    {
      name: 'Dr. Marcus Vance',
      role: 'visionary',
      title: 'Chief Implantologist',
      bio: 'A pioneer in robotic-assisted dental implants and bone grafting procedures.',
      imagePath: '/images/home/doctor-marcus.png',
      specialtiesJson: JSON.stringify(['Robotic Implants', 'Bone Grafting', 'Sinus Lifts']),
      educationJson: JSON.stringify(['DDS - NYU Dentistry', 'Mastership - ICOI']),
    },
    {
      name: 'Dr. Sarah Chen',
      role: 'visionary',
      title: 'Orthodontic Specialist',
      bio: 'Expert in invisible alignment systems and adult aesthetic orthodontics.',
      imagePath: '/images/home/doctor-sarah.png',
      specialtiesJson: JSON.stringify(['Invisalign Aligner Tech', 'Adult Aesthetic Ortho', 'Bite Corrections']),
      educationJson: JSON.stringify(['DDS - Harvard Dental', 'Residency - UCSF Ortho']),
    },
    {
      name: 'Dr. Mark Wright',
      role: 'department-head',
      title: 'Head of Implantology',
      bio: 'Expert in reconstructive surgery and complex implant positioning utilizing advanced 3D diagnostic guides.',
      imagePath: '/images/home/doctor-marcus.png',
      specialtiesJson: JSON.stringify(['Computer Guided Implants', '3D Bone Scanning']),
    },
    {
      name: 'Dr. Jane Cooper',
      role: 'department-head',
      title: 'Head of Cosmetic Dentistry',
      bio: 'Renowned cosmetic surgeon specializing in porcelain veneers, bonding, and full-smile designs.',
      imagePath: '/images/home/doctor-elena.png',
      specialtiesJson: JSON.stringify(['Smile Designs', 'Laser Gum Contouring']),
    },
    {
      name: 'Dr. Emily Wilson',
      role: 'department-head',
      title: 'Head of Orthodontics',
      bio: 'Leader in digital orthodontic alignments, Invisalign protocols, and biomechanical optimization.',
      imagePath: '/images/home/doctor-sarah.png',
      specialtiesJson: JSON.stringify(['Clear Aligner Therapy', 'Childhood Retention']),
    },
    {
      name: 'Dr. Theresa Webb',
      role: 'core-team',
      title: 'Periodontist',
      bio: 'Specializing in soft tissue grafts, bone regeneration, and the treatment of periodontal diseases.',
      imagePath: '/images/home/doctor-marcus.png',
      specialtiesJson: JSON.stringify(['Periodontal Regeneration', 'Gum Grafting']),
    },
    {
      name: 'Dr. Brooklyn Simmons',
      role: 'core-team',
      title: 'Oral Surgeon',
      bio: 'Performing wisdom teeth extractions, maxillofacial procedures, and emergency trauma operations.',
      imagePath: '/images/home/doctor-elena.png',
      specialtiesJson: JSON.stringify(['Maxillofacial Surgery', 'Wisdom Teeth Extraction']),
    },
    {
      name: 'Dr. Adelaida Smith',
      role: 'core-team',
      title: 'Endodontist',
      bio: 'Specialist in microscopic root canal therapies, pulpal diagnostics, and biological tooth preservation.',
      imagePath: '/images/home/doctor-sarah.png',
      specialtiesJson: JSON.stringify(['Microscopic Endodontics', 'Apicoectomy']),
    },
  ];

  for (const d of doctorsData) {
    const existing = await prisma.doctor.findFirst({
      where: { name: d.name, role: d.role },
    });
    if (existing) {
      await prisma.doctor.update({
        where: { id: existing.id },
        data: d,
      });
    } else {
      await prisma.doctor.create({
        data: d,
      });
    }
  }
  console.log('Doctors seeded.');

  // 4. Seed Reviews
  const reviewsData = [
    {
      author: 'Sarah Jenkins',
      role: 'Porcelain Veneers Patient',
      rating: 5,
      text: 'Dr. Evelyn Sterling completely transformed my smile with porcelain veneers! The process was comfortable and the results are incredibly natural. I couldn’t be happier.',
      date: '2026-06-15',
    },
    {
      author: 'James Miller',
      role: 'Dental Implants Patient',
      rating: 5,
      text: 'Getting dental implants here was the best decision of my life. The titanium precision and surgical care were top-notch, and the new teeth feel exactly like my own.',
      date: '2026-07-02',
    },
    {
      author: 'Evelyn Carter',
      role: 'Smile Makeover Patient',
      rating: 5,
      text: 'The absolute gold standard of dentistry! The calming atmosphere, sedation options, and Dr. Sterling\'s aesthetic artistry made my smile alignment project a absolute joy.',
      date: '2026-07-10',
    },
  ];

  for (const r of reviewsData) {
    const existing = await prisma.review.findFirst({
      where: { author: r.author, text: r.text },
    });
    if (!existing) {
      await prisma.review.create({ data: r });
    }
  }
  console.log('Reviews seeded.');

  // 6. Seed Gallery Cases
  const galleryData = [
    {
      id: 'case-veneers-comparison',
      variant: 'comparison',
      title: 'Bespoke Veneers Transformation',
      description: 'Complete cosmetic rehabilitation utilizing custom hand-layered porcelain veneers.',
      category: 'Veneers',
      imagesJson: JSON.stringify({
        before: {
          publicId: 'home/about-hero.png',
          url: '/images/home/about-hero.png',
          altText: 'Teeth before veneers alignment',
        },
        after: {
          publicId: 'home/cosmetic-smile.png',
          url: '/images/home/cosmetic-smile.png',
          altText: 'Teeth after veneers alignment',
        },
      }),
      tagsJson: JSON.stringify(['Veneers', 'Smile Makeover', 'Porcelain']),
      isVerifiedPatient: true,
      featured: true,
      status: 'published',
      displayOrder: 1,
    },
    {
      id: 'case-implants-vertical',
      variant: 'vertical',
      title: 'Robotic Guided Implant Roster',
      description: 'Surgical rehabilitation of posterior tooth area with 3D digital precision.',
      category: 'Implants',
      imagesJson: JSON.stringify({
        main: {
          publicId: 'home/dental-implants.png',
          url: '/images/home/dental-implants.png',
          altText: 'Surgical implant restoration details',
        },
      }),
      tagsJson: JSON.stringify(['Implants', 'Computer-Guided', '3D Scanned']),
      isVerifiedPatient: true,
      featured: false,
      status: 'published',
      displayOrder: 2,
    },
    {
      id: 'case-whitening-square',
      variant: 'square',
      title: 'Laser Bright Enhancement',
      description: 'Clinical photo showing shade brightness improvement after dynamic whitening treatment.',
      category: 'Whitening',
      imagesJson: JSON.stringify({
        main: {
          publicId: 'home/dental-tech.png',
          url: '/images/home/dental-tech.png',
          altText: 'Whitening laser therapy procedure',
        },
      }),
      tagsJson: JSON.stringify(['Whitening', 'Laser', 'Teeth Bleaching']),
      isVerifiedPatient: true,
      featured: false,
      status: 'published',
      displayOrder: 3,
    },
    {
      id: 'case-orthodontics-widesplit',
      variant: 'wideSplit',
      title: 'Clear Alignment, Real Results',
      description: 'Invisalign clear aligner correction to fix orthodontic crowded bite configuration.',
      category: 'Invisalign',
      imagesJson: JSON.stringify({
        main: {
          publicId: 'home/orthodontics.png',
          url: '/images/home/orthodontics.png',
          altText: 'Invisalign clear orthodontic aligners',
        },
      }),
      tagsJson: JSON.stringify(['Invisalign', 'Orthodontics', 'Clear Aligners']),
      isVerifiedPatient: true,
      featured: false,
      status: 'published',
      displayOrder: 4,
    },
    {
      id: 'case-mouth-small',
      variant: 'small',
      title: 'Digital Smile Design',
      description: 'Preview of clinical digital impressions and planning for cosmetic restorations.',
      category: 'Full Mouth',
      imagesJson: JSON.stringify({
        main: {
          publicId: 'home/hero-dentist.png',
          url: '/images/home/hero-dentist.png',
          altText: 'Digital smile design screen mockup',
        },
      }),
      tagsJson: JSON.stringify(['Digital Smile Design', '3D Scan', 'Rehabilitation']),
      isVerifiedPatient: true,
      featured: false,
      status: 'published',
      displayOrder: 5,
    },
  ];

  for (const g of galleryData) {
    const existing = await prisma.galleryItem.findUnique({
      where: { id: g.id },
    });
    if (!existing) {
      await prisma.galleryItem.create({ data: g });
    }
  }
  console.log('Gallery cases seeded.');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
