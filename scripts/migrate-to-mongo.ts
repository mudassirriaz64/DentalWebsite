import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client as PgClient } from 'pg';
import { MongoClient, ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  'postgresql://neondb_owner:npg_M4dORlSaAhk3@ep-shiny-union-audwwizu-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://dentalcosm27_db_user:y5xXctEU8fZboNFm@ac-rlzfpct-shard-00-00.lodivts.mongodb.net:27017,ac-rlzfpct-shard-00-01.lodivts.mongodb.net:27017,ac-rlzfpct-shard-00-02.lodivts.mongodb.net:27017/?ssl=true&replicaSet=atlas-emtgdb-shard-0&authSource=admin&appName=DentalWebsite';

interface UploadResult {
  publicId: string;
  url: string;
}

const uploadedCache = new Map<string, UploadResult>();

/**
 * Uploads a local image file to Cloudinary if it exists on disk.
 * Skips and logs warning if missing.
 */
async function uploadImageToCloudinary(
  localPath: string | null | undefined,
  recordContext: string
): Promise<UploadResult | null> {
  if (!localPath || !localPath.trim()) return null;

  const trimmedPath = localPath.trim();

  // If already a Cloudinary / web URL
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return { publicId: '', url: trimmedPath };
  }

  // Check cache to avoid duplicate uploads of identical images
  if (uploadedCache.has(trimmedPath)) {
    return uploadedCache.get(trimmedPath)!;
  }

  // Build absolute path to public image folder
  const relativePath = trimmedPath.startsWith('/') ? trimmedPath.substring(1) : trimmedPath;
  const fullPath = path.join(process.cwd(), 'public', relativePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  WARNING [${recordContext}]: File not found at path "${fullPath}". Image field set to null.`);
    return null;
  }

  try {
    console.log(`📤 Uploading "${relativePath}" to Cloudinary for ${recordContext}...`);
    const uploadRes = await cloudinary.uploader.upload(fullPath, {
      folder: 'dental-website',
      use_filename: true,
      unique_filename: true,
    });

    const result: UploadResult = {
      publicId: uploadRes.public_id,
      url: uploadRes.secure_url,
    };

    uploadedCache.set(trimmedPath, result);
    console.log(`✅ Uploaded successfully: ${result.url}`);
    return result;
  } catch (err: any) {
    console.warn(`⚠️  WARNING [${recordContext}]: Cloudinary upload failed for "${fullPath}": ${err.message}. Setting image to null.`);
    return null;
  }
}

async function runMigration() {
  console.log('🚀 Starting Data + Image Migration from PostgreSQL to MongoDB Atlas...');

  const pgClient = new PgClient({ connectionString: POSTGRES_URL });
  await pgClient.connect();
  console.log('✅ Connected to PostgreSQL source database.');

  const mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  const db = mongoClient.db();
  console.log('✅ Connected to MongoDB target database.');

  // Store ID mappings for relational references (pgId -> mongoObjectId)
  const serviceIdMap = new Map<string, ObjectId>();
  const doctorIdMap = new Map<string, ObjectId>();
  const serviceTitleMap = new Map<string, string>();
  const doctorNameMap = new Map<string, string>();

  // Clear target MongoDB collections for clean migration rerun
  const collections = ['AdminUser', 'Service', 'Doctor', 'Appointment', 'ContactSubmission', 'Review', 'SiteStat', 'GalleryItem', 'ClinicSettings', 'FounderSpotlight'];
  for (const col of collections) {
    await db.collection(col).deleteMany({});
  }
  console.log('🧹 Cleaned existing MongoDB target collections for fresh migration.');

  // Track counts for verification
  const counts = {
    AdminUser: 0,
    Service: 0,
    Doctor: 0,
    Appointment: 0,
    ContactSubmission: 0,
    Review: 0,
    SiteStat: 0,
    GalleryItem: 0,
    ClinicSettings: 0,
    OpeningHoursEntry: 0,
    FounderSpotlight: 0,
  };

  try {
    // -------------------------------------------------------------
    // 1. AdminUser
    // -------------------------------------------------------------
    console.log('\n--- Migrating AdminUsers ---');
    const adminRes = await pgClient.query('SELECT * FROM "AdminUser"');
    for (const row of adminRes.rows) {
      const doc = {
        _id: new ObjectId(),
        username: row.username,
        passwordHash: row.passwordHash,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };
      await db.collection('AdminUser').insertOne(doc);
      counts.AdminUser++;
    }
    console.log(`Migrated ${counts.AdminUser} AdminUser records.`);

    // -------------------------------------------------------------
    // 2. Service
    // -------------------------------------------------------------
    console.log('\n--- Migrating Services ---');
    const serviceRes = await pgClient.query('SELECT * FROM "Service"');
    for (const row of serviceRes.rows) {
      const mongoId = new ObjectId();
      serviceIdMap.set(row.id, mongoId);
      serviceTitleMap.set(row.id, row.title);

      // Parse JSON string into real string array
      let bullets: string[] = [];
      try {
        bullets = JSON.parse(row.bulletsJson || '[]');
      } catch {
        bullets = [];
      }

      // Upload image
      const imgUpload = await uploadImageToCloudinary(row.imagePath, `Service "${row.title}"`);

      const doc = {
        _id: mongoId,
        title: row.title,
        shortDescription: row.shortDescription,
        description: row.description,
        slug: row.slug,
        iconName: row.iconName,
        imagePath: imgUpload ? imgUpload.url : null,
        variant: row.variant || null,
        ctaLabel: row.ctaLabel || null,
        bullets: bullets,
        featured: Boolean(row.featured),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('Service').insertOne(doc);
      counts.Service++;
    }
    console.log(`Migrated ${counts.Service} Service records.`);

    // -------------------------------------------------------------
    // 3. Doctor
    // -------------------------------------------------------------
    console.log('\n--- Migrating Doctors ---');
    const doctorRes = await pgClient.query('SELECT * FROM "Doctor"');
    for (const row of doctorRes.rows) {
      const mongoId = new ObjectId();
      doctorIdMap.set(row.id, mongoId);
      doctorNameMap.set(row.id, row.name);

      let specialties: string[] = [];
      let education: string[] = [];
      try { specialties = JSON.parse(row.specialtiesJson || '[]'); } catch {}
      try { education = JSON.parse(row.educationJson || '[]'); } catch {}

      const imgUpload = await uploadImageToCloudinary(row.imagePath, `Doctor "${row.name}"`);

      const doc = {
        _id: mongoId,
        name: row.name,
        title: row.title,
        specialties: specialties,
        bio: row.bio,
        imagePath: imgUpload ? imgUpload.url : row.imagePath || '',
        education: education,
        displayOrder: Number(row.displayOrder || 0),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('Doctor').insertOne(doc);
      counts.Doctor++;
    }
    console.log(`Migrated ${counts.Doctor} Doctor records.`);

    // -------------------------------------------------------------
    // 4. Appointment
    // -------------------------------------------------------------
    console.log('\n--- Migrating Appointments ---');
    const appointmentRes = await pgClient.query('SELECT * FROM "Appointment"');
    for (const row of appointmentRes.rows) {
      const mappedServiceId = serviceIdMap.get(row.serviceId);
      const mappedDoctorId = row.doctorId ? doctorIdMap.get(row.doctorId) : null;

      const doc = {
        _id: new ObjectId(),
        patientName: row.patientName,
        email: row.email,
        phone: row.phone,
        whatsapp: row.whatsapp || null,
        serviceId: mappedServiceId || null,
        serviceTitle: serviceTitleMap.get(row.serviceId) || 'General Service',
        doctorId: mappedDoctorId || null,
        doctorName: row.doctorId ? doctorNameMap.get(row.doctorId) || null : null,
        preferredDate: row.preferredDate ? new Date(row.preferredDate) : null,
        preferredTime: row.preferredTime || null,
        notes: row.notes || null,
        status: row.status || 'pending',
        isRead: Boolean(row.isRead),
        internalNote: row.internalNote || null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('Appointment').insertOne(doc);
      counts.Appointment++;
    }
    console.log(`Migrated ${counts.Appointment} Appointment records.`);

    // -------------------------------------------------------------
    // 5. ContactSubmission
    // -------------------------------------------------------------
    console.log('\n--- Migrating ContactSubmissions ---');
    const contactRes = await pgClient.query('SELECT * FROM "ContactSubmission"');
    for (const row of contactRes.rows) {
      const doc = {
        _id: new ObjectId(),
        fullName: row.fullName,
        serviceInterest: row.serviceInterest,
        email: row.email,
        phone: row.phone,
        whatsapp: row.whatsapp || null,
        message: row.message || null,
        status: row.status || 'new',
        isRead: Boolean(row.isRead),
        internalNote: row.internalNote || null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('ContactSubmission').insertOne(doc);
      counts.ContactSubmission++;
    }
    console.log(`Migrated ${counts.ContactSubmission} ContactSubmission records.`);

    // -------------------------------------------------------------
    // 6. Review
    // -------------------------------------------------------------
    console.log('\n--- Migrating Reviews ---');
    const reviewRes = await pgClient.query('SELECT * FROM "Review"');
    for (const row of reviewRes.rows) {
      const avatarUpload = await uploadImageToCloudinary(
        row.patientAvatarUrl,
        `Review by "${row.patientName}"`
      );

      const doc = {
        _id: new ObjectId(),
        patientName: row.patientName,
        patientAvatarUrl: avatarUpload ? avatarUpload.url : row.patientAvatarUrl || null,
        rating: Number(row.rating),
        title: row.title,
        body: row.body,
        category: row.category,
        treatmentType: row.treatmentType || null,
        isVerifiedPatient: Boolean(row.isVerifiedPatient),
        status: row.status || 'pending',
        featured: Boolean(row.featured),
        displayOrder: Number(row.displayOrder || 0),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('Review').insertOne(doc);
      counts.Review++;
    }
    console.log(`Migrated ${counts.Review} Review records.`);

    // -------------------------------------------------------------
    // 7. GalleryItem
    // -------------------------------------------------------------
    console.log('\n--- Migrating GalleryItems ---');
    const galleryRes = await pgClient.query('SELECT * FROM "GalleryItem"');
    for (const row of galleryRes.rows) {
      const beforeUp = await uploadImageToCloudinary(
        row.beforeImageUrl,
        `Gallery "${row.title}" (Before)`
      );
      const afterUp = await uploadImageToCloudinary(
        row.afterImageUrl,
        `Gallery "${row.title}" (After)`
      );
      const mainUp = await uploadImageToCloudinary(
        row.mainImageUrl,
        `Gallery "${row.title}" (Main)`
      );

      const doc = {
        _id: new ObjectId(),
        variant: row.variant,
        title: row.title,
        description: row.description,
        category: row.category,
        beforeImageId: beforeUp ? beforeUp.publicId : row.beforeImageId || null,
        beforeImageUrl: beforeUp ? beforeUp.url : row.beforeImageUrl || null,
        beforeImageAlt: row.beforeImageAlt || null,
        afterImageId: afterUp ? afterUp.publicId : row.afterImageId || null,
        afterImageUrl: afterUp ? afterUp.url : row.afterImageUrl || null,
        afterImageAlt: row.afterImageAlt || null,
        mainImageId: mainUp ? mainUp.publicId : row.mainImageId || null,
        mainImageUrl: mainUp ? mainUp.url : row.mainImageUrl || null,
        mainImageAlt: row.mainImageAlt || null,
        tags: row.tags || null,
        isVerifiedPatient: Boolean(row.isVerifiedPatient),
        featured: Boolean(row.featured),
        status: row.status || 'draft',
        displayOrder: Number(row.displayOrder || 0),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('GalleryItem').insertOne(doc);
      counts.GalleryItem++;
    }
    console.log(`Migrated ${counts.GalleryItem} GalleryItem records.`);

    // -------------------------------------------------------------
    // 8. SiteStat
    // -------------------------------------------------------------
    console.log('\n--- Migrating SiteStats ---');
    const statRes = await pgClient.query('SELECT * FROM "SiteStat"');
    for (const row of statRes.rows) {
      const doc = {
        _id: new ObjectId(),
        page: row.page,
        label: row.label,
        value: row.value,
        displayOrder: Number(row.displayOrder || 0),
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('SiteStat').insertOne(doc);
      counts.SiteStat++;
    }
    console.log(`Migrated ${counts.SiteStat} SiteStat records.`);

    // -------------------------------------------------------------
    // 9. ClinicSettings + Embedded OpeningHoursEntry
    // -------------------------------------------------------------
    console.log('\n--- Migrating ClinicSettings & Embedding OpeningHoursEntries ---');
    const clinicRes = await pgClient.query('SELECT * FROM "ClinicSettings"');
    const hoursRes = await pgClient.query('SELECT * FROM "OpeningHoursEntry" ORDER BY "displayOrder" ASC');

    for (const row of clinicRes.rows) {
      const mapUp = await uploadImageToCloudinary(
        row.mapImageUrl,
        `ClinicSettings Map Image`
      );

      const matchingHours = hoursRes.rows
        .filter((h) => h.clinicSettingsId === row.id)
        .map((h) => {
          counts.OpeningHoursEntry++;
          return {
            label: h.label,
            hours: h.hours,
            isEmergencyNote: Boolean(h.isEmergencyNote),
            isDimmed: Boolean(h.isDimmed),
            displayOrder: Number(h.displayOrder || 0),
          };
        });

      const doc = {
        _id: new ObjectId(),
        address: row.address,
        phone: row.phone,
        phoneNote: row.phoneNote || null,
        email: row.email,
        emergencyPhone: row.emergencyPhone || null,
        mapImageUrl: mapUp ? mapUp.url : row.mapImageUrl || null,
        mapDirectionsUrl: row.mapDirectionsUrl || null,
        openingHours: matchingHours,
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('ClinicSettings').insertOne(doc);
      counts.ClinicSettings++;
    }
    console.log(`Migrated ${counts.ClinicSettings} ClinicSettings (with ${counts.OpeningHoursEntry} embedded hours entries).`);

    // -------------------------------------------------------------
    // 10. FounderSpotlight
    // -------------------------------------------------------------
    console.log('\n--- Migrating FounderSpotlight ---');
    const spotlightRes = await pgClient.query('SELECT * FROM "FounderSpotlight"');
    for (const row of spotlightRes.rows) {
      const imgUpload = await uploadImageToCloudinary(
        row.imagePath,
        `FounderSpotlight "${row.name}"`
      );

      const doc = {
        _id: new ObjectId(),
        name: row.name,
        title: row.title,
        imagePath: imgUpload ? imgUpload.url : row.imagePath || '',
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      await db.collection('FounderSpotlight').insertOne(doc);
      counts.FounderSpotlight++;
    }
    console.log(`Migrated ${counts.FounderSpotlight} FounderSpotlight records.`);

    console.log('\n==================================================');
    console.log('🎉 MIGRATION SUMMARY & RECORD COUNTS');
    console.log('==================================================');
    console.table(counts);
    console.log('==================================================');

  } catch (err: any) {
    console.error('❌ MIGRATION FAILED WITH ERROR:', err);
  } finally {
    await pgClient.end();
    await mongoClient.close();
    console.log('🔌 Closed PostgreSQL and MongoDB client connections.');
  }
}

runMigration();
