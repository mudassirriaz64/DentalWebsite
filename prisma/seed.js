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
      title: 'Lead Cosmetic Surgeon',
      bio: 'Specializing in full-mouth rehabilitation and smile design with over 25 years of experience.',
      imagePath: '/images/home/doctor-elena.png',
      specialtiesJson: JSON.stringify([
        'Full Mouth Rehabilitation',
        'Porcelain Veneers',
        'Sedation Dentistry',
      ]),
      educationJson: JSON.stringify(['DDS - Columbia University', 'Fellowship - AACD']),
      displayOrder: 1,
    },
    {
      name: 'Dr. Marcus Vance',
      title: 'Chief Implantologist',
      bio: 'A pioneer in robotic-assisted dental implants and bone grafting procedures.',
      imagePath: '/images/home/doctor-marcus.png',
      specialtiesJson: JSON.stringify(['Robotic Implants', 'Bone Grafting', 'Sinus Lifts']),
      educationJson: JSON.stringify(['DDS - NYU Dentistry', 'Mastership - ICOI']),
      displayOrder: 2,
    },
    {
      name: 'Dr. Sarah Chen',
      title: 'Orthodontic Specialist',
      bio: 'Expert in invisible alignment systems and adult aesthetic orthodontics.',
      imagePath: '/images/home/doctor-sarah.png',
      specialtiesJson: JSON.stringify(['Invisalign Aligner Tech', 'Adult Aesthetic Ortho', 'Bite Corrections']),
      educationJson: JSON.stringify(['DDS - Harvard Dental', 'Residency - UCSF Ortho']),
      displayOrder: 3,
    },
    {
      name: 'Dr. Mark Wright',
      title: 'Implantology Specialist',
      bio: 'Expert in reconstructive surgery and complex implant positioning utilizing advanced 3D diagnostic guides.',
      imagePath: '/images/home/doctor-marcus.png',
      specialtiesJson: JSON.stringify(['Computer Guided Implants', '3D Bone Scanning']),
      displayOrder: 4,
    },
    {
      name: 'Dr. Jane Cooper',
      title: 'Lead Cosmetic Surgeon',
      bio: 'Renowned cosmetic surgeon specializing in porcelain veneers, bonding, and full-smile designs.',
      imagePath: '/images/home/doctor-elena.png',
      specialtiesJson: JSON.stringify(['Smile Designs', 'Laser Gum Contouring']),
      displayOrder: 5,
    },
    {
      name: 'Dr. Emily Wilson',
      title: 'Orthodontic Specialist',
      bio: 'Leader in digital orthodontic alignments, Invisalign protocols, and biomechanical optimization.',
      imagePath: '/images/home/doctor-sarah.png',
      specialtiesJson: JSON.stringify(['Clear Aligner Therapy', 'Childhood Retention']),
      displayOrder: 6,
    },
    {
      name: 'Dr. Theresa Webb',
      title: 'Periodontist',
      bio: 'Specializing in soft tissue grafts, bone regeneration, and the treatment of periodontal diseases.',
      imagePath: '/images/home/doctor-marcus.png',
      specialtiesJson: JSON.stringify(['Periodontal Regeneration', 'Gum Grafting']),
      displayOrder: 7,
    },
    {
      name: 'Dr. Brooklyn Simmons',
      title: 'Oral Surgeon',
      bio: 'Performing wisdom teeth extractions, maxillofacial procedures, and emergency trauma operations.',
      imagePath: '/images/home/doctor-elena.png',
      specialtiesJson: JSON.stringify(['Maxillofacial Surgery', 'Wisdom Teeth Extraction']),
      displayOrder: 8,
    },
    {
      name: 'Dr. Adelaida Smith',
      title: 'Endodontist',
      bio: 'Specialist in microscopic root canal therapies, pulpal diagnostics, and biological tooth preservation.',
      imagePath: '/images/home/doctor-sarah.png',
      specialtiesJson: JSON.stringify(['Microscopic Endodontics', 'Apicoectomy']),
      displayOrder: 9,
    },
  ];

  for (const d of doctorsData) {
    const existing = await prisma.doctor.findFirst({
      where: { name: d.name },
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
      patientName: 'Eleanor Vance',
      rating: 5,
      title: 'Brighter teeth in one visit',
      body: 'Bespoke veneers completely transformed my smile and confidence. The aesthetic precision of Dr. Sterling is unparalleled. The entire team was incredibly calming and professional.',
      category: 'Cosmetic',
      treatmentType: 'Porcelain Veneers',
      isVerifiedPatient: true,
      status: 'approved',
      featured: true,
      displayOrder: 1,
    },
    {
      patientName: 'Robert Harrison',
      rating: 5,
      title: 'Amazing robotic guided implant',
      body: 'I was terrified of implant surgery, but the 3D computer-guided procedure was completely painless. Dr. Marcus Vance explained everything clearly. Unbeatable stability.',
      category: 'Implants',
      treatmentType: 'Dental Implants',
      isVerifiedPatient: true,
      status: 'approved',
      featured: false,
      displayOrder: 2,
    },
    {
      patientName: 'Linda Cooper',
      rating: 5,
      title: 'Relaxing hygiene therapy',
      body: 'The hygiene treatment was so gentle and thorough. The spa-like environment made me forget I was at a dental practice. Highly recommended for nervous patients.',
      category: 'General Care',
      treatmentType: 'Hygiene Therapy',
      isVerifiedPatient: true,
      status: 'approved',
      featured: false,
      displayOrder: 3,
    },
    {
      patientName: 'Clara Thorne',
      rating: 5,
      title: 'Professional whitening results',
      body: 'My teeth are several shades brighter after the laser whitening session. Fast, clean, and zero post-treatment sensitivity. Wonderful cosmetic care.',
      category: 'Cosmetic',
      treatmentType: 'Laser Whitening',
      isVerifiedPatient: true,
      status: 'approved',
      featured: false,
      displayOrder: 4,
    },
    {
      patientName: 'James Miller',
      rating: 5,
      title: 'Full arch restoration',
      body: 'The hybrid implant arch has given me my life back. I can eat normally again. Dr. Marcus and his surgical team are absolute legends in implant dentistry.',
      category: 'Implants',
      treatmentType: 'Hybrid Implant Arch',
      isVerifiedPatient: true,
      status: 'approved',
      featured: false,
      displayOrder: 5,
    },
    {
      patientName: 'David Wilson',
      rating: 4,
      title: 'Great routine checkup',
      body: 'Very modern clinic, short wait times, and friendly staff. The diagnostic 3D scan was really interesting to see.',
      category: 'General Care',
      treatmentType: 'Routine Diagnostics',
      isVerifiedPatient: false,
      status: 'pending',
      featured: false,
      displayOrder: 6,
    },
    {
      patientName: 'Jessica Taylor',
      rating: 5,
      title: 'Beautiful bonding work',
      body: 'Had some minor chipping fixed with cosmetic bonding. It blends in perfectly with my natural teeth. Amazing detail!',
      category: 'Cosmetic',
      treatmentType: 'Composite Bonding',
      isVerifiedPatient: true,
      status: 'pending',
      featured: false,
      displayOrder: 7,
    },
    {
      patientName: 'Spam User',
      rating: 1,
      title: 'Buy cheap coins',
      body: 'Check out our website for cheap game coins online!',
      category: 'General Care',
      treatmentType: 'Unknown',
      isVerifiedPatient: false,
      status: 'rejected',
      featured: false,
      displayOrder: 8,
    },
  ];

  for (const r of reviewsData) {
    const existing = await prisma.review.findFirst({
      where: { patientName: r.patientName, title: r.title },
    });
    if (!existing) {
      await prisma.review.create({ data: r });
    }
  }
  console.log('Reviews seeded.');

  // 5. Seed Site Stats for Reviews page
  const statsData = [
    { page: 'reviews', label: 'Five Star Reviews', value: '2,500+', displayOrder: 1 },
    { page: 'reviews', label: 'Happy Patients', value: '15k+', displayOrder: 2 },
    { page: 'reviews', label: 'Awards Won', value: '12+', displayOrder: 3 },
    { page: 'reviews', label: 'Success Rate', value: '99%', displayOrder: 4 },
  ];

  for (const s of statsData) {
    const existing = await prisma.siteStat.findFirst({
      where: { page: s.page, label: s.label },
    });
    if (!existing) {
      await prisma.siteStat.create({ data: s });
    }
  }
  console.log('Site stats seeded.');

  // 6. Seed Gallery Cases
  const galleryData = [
    {
      id: 'case-veneers-comparison',
      variant: 'comparison',
      title: 'Bespoke Veneers Transformation',
      description: 'Complete cosmetic rehabilitation utilizing custom hand-layered porcelain veneers.',
      category: 'Veneers',
      beforeImageId: 'home/about-hero.png',
      beforeImageUrl: '/images/home/about-hero.png',
      beforeImageAlt: 'Teeth before veneers alignment',
      afterImageId: 'home/cosmetic-smile.png',
      afterImageUrl: '/images/home/cosmetic-smile.png',
      afterImageAlt: 'Teeth after veneers alignment',
      tags: JSON.stringify(['Veneers', 'Smile Makeover', 'Porcelain']),
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
      mainImageId: 'home/dental-implants.png',
      mainImageUrl: '/images/home/dental-implants.png',
      mainImageAlt: 'Surgical implant restoration details',
      tags: JSON.stringify(['Implants', 'Computer-Guided', '3D Scanned']),
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
      mainImageId: 'home/dental-tech.png',
      mainImageUrl: '/images/home/dental-tech.png',
      mainImageAlt: 'Whitening laser therapy procedure',
      tags: JSON.stringify(['Whitening', 'Laser', 'Teeth Bleaching']),
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
      mainImageId: 'home/orthodontics.png',
      mainImageUrl: '/images/home/orthodontics.png',
      mainImageAlt: 'Invisalign clear orthodontic aligners',
      tags: JSON.stringify(['Invisalign', 'Orthodontics', 'Clear Aligners']),
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
      mainImageId: 'home/hero-dentist.png',
      mainImageUrl: '/images/home/hero-dentist.png',
      mainImageAlt: 'Digital smile design screen mockup',
      tags: JSON.stringify(['Digital Smile Design', '3D Scan', 'Rehabilitation']),
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

  // 7. Seed Clinic Settings (Singleton)
  const settingsId = 'clinic-settings-singleton';
  const existingSettings = await prisma.clinicSettings.findUnique({
    where: { id: settingsId },
  });

  if (!existingSettings) {
    await prisma.clinicSettings.create({
      data: {
        id: settingsId,
        address: '4517 Washington Ave. Manchester, Kentucky 39495',
        phone: '(502) 555-0107',
        phoneNote: 'Mon-Fri, 9am - 5pm',
        email: 'office@dentalcosmetic.com',
        emergencyPhone: '(502) 999-0000',
        mapDirectionsUrl: 'https://maps.google.com',
        openingHours: {
          create: [
            { label: 'Mon - Thu', hours: '09:00 - 18:00', isEmergencyNote: false, isDimmed: false, displayOrder: 1 },
            { label: 'Friday', hours: '09:00 - 16:00', isEmergencyNote: false, isDimmed: false, displayOrder: 2 },
            { label: 'Saturday', hours: 'Emergency Only', isEmergencyNote: true, isDimmed: false, displayOrder: 3 },
            { label: 'Sunday', hours: 'Closed', isEmergencyNote: false, isDimmed: true, displayOrder: 4 },
          ],
        },
      },
    });
    console.log('Clinic settings and opening hours seeded.');
  }

  // 8. Seed Contact Submissions
  const submissionsData = [
    {
      fullName: 'Alice Johnson',
      serviceInterest: 'Dental Implants',
      email: 'alice@example.com',
      phone: '(555) 019-2834',
      message: 'Looking to schedule a single tooth replacement consultation.',
      status: 'new',
      isRead: false,
    },
    {
      fullName: 'Bob Smith',
      serviceInterest: 'Veneers & Whitening',
      email: 'bob@example.com',
      phone: '(555) 014-9912',
      message: 'Do you offer virtual smile preview design consults?',
      status: 'contacted',
      isRead: true,
      internalNote: 'Called Bob on Thursday. Sent cosmetic services pamphlet.',
    },
  ];

  for (const s of submissionsData) {
    const existing = await prisma.contactSubmission.findFirst({
      where: { email: s.email, serviceInterest: s.serviceInterest },
    });
    if (!existing) {
      await prisma.contactSubmission.create({ data: s });
    }
  }
  console.log('Sample contact submissions seeded.');

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
