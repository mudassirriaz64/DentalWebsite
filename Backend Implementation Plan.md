# Implementation Plan - Admin Dashboard & Database Layer (Local SQLite Dev)

This plan outlines the design, database models, route changes, and public page migrations to transition from static arrays to a fully dynamic database-backed architecture using Prisma + a local SQLite database for zero-config development.

## User Review Required: SQLite Database Local Config

We will configure Prisma to use a local **SQLite** database file (`prisma/dev.db`). This bypasses any database credential constraints, allowing you to run migrations and test the admin dashboard locally immediately.

> [!TIP]
> **Switching to Production Postgres Later**:
> When you obtain your Supabase or Neon credentials, you can switch to Postgres by editing `prisma/schema.prisma`:
> ```prisma
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL")
> }
> ```
> and then updating your `.env` file with the database connection URL and running `npx prisma db push`.

---

## Proposed SQLite-Compatible Prisma Schema

Since SQLite does not support native `String[]` array columns, fields like `bullets`, `specialties`, and `education` are modeled as standard strings that store serialized JSON arrays (e.g. `'["Fluoride Treatment", "Cleaning"]'`), parsed automatically in our service layer.

Here is the schema to be created in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model AdminUser {
  id           String   @id @default(uuid())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ContactSubmission {
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String?
  message   String
  createdAt DateTime @default(now())
}

model Service {
  id               String        @id @default(uuid())
  title            String
  shortDescription String
  description      String
  slug             String        @unique
  iconName         String
  imagePath        String?
  variant          String?       // "large-image-card" | "dark-teal-card" | "white-card" | "accent-pink-card"
  ctaLabel         String?
  bulletsJson      String        @default("[]") // Serialized JSON array of strings
  appointments     Appointment[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model Appointment {
  id            String   @id @default(uuid())
  name          String
  email         String
  phone         String
  preferredDate DateTime
  preferredTime String
  message       String?
  status        String   @default("pending") // "pending" | "confirmed" | "cancelled"
  serviceId     String
  service       Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Doctor {
  id              String   @id @default(uuid())
  name            String
  role            String
  specialtiesJson String   @default("[]") // Serialized JSON array of strings
  bio             String
  imagePath       String
  educationJson   String   @default("[]") // Serialized JSON array of strings
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Review {
  id        String   @id @default(uuid())
  author    String
  role      String?
  rating    Int      @default(5)
  text      String
  date      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model GalleryImage {
  id        String   @id @default(uuid())
  imageUrl  String
  caption   String?
  category  String?  // e.g. "Cosmetic", "Implants", "Clinic"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Proposed Changes

### 📦 Dependency Installations
- Install `prisma`, `@prisma/client`, `zod`, and `bcryptjs` + type helpers.

### 🛡️ Authentication Flow
- **Session Auth**: A session cookie-based flow using a hashed password check.
- **Login Endpoint**: `/api/admin/login` parses credentials, validates with `bcryptjs`, and sets the cookie.

### 🛠️ Step 2: Scaffold API Routes (`/src/app/api/admin/*`)
Create Next.js route handlers (`route.ts`) implementing Zod schema validations for CRUD:
- `/api/admin/services/route.ts` (GET / POST)
- `/api/admin/services/[id]/route.ts` (PATCH / DELETE)
- `/api/admin/doctors/route.ts` (GET / POST)
- `/api/admin/doctors/[id]/route.ts` (PATCH / DELETE)
- `/api/admin/reviews/route.ts` (GET / POST / PATCH / DELETE)
- `/api/admin/gallery/route.ts` (GET / POST / PATCH / DELETE)
- `/api/admin/contacts/route.ts` (GET / DELETE)
- `/api/admin/appointments/route.ts` (GET / PATCH / DELETE)
- Public contact form handler: `/api/contact/route.ts` (POST - stores entry in DB instead of console stubs)
- Public booking form handler: `/api/appointments/route.ts` (POST - submits and links to service in DB)

### 🖥️ Step 3: Scaffold `/admin` UI
- Simple, unstyled layout (functionality first):
  - `/admin/login/page.tsx`: Credential login form.
  - `/admin/page.tsx`: Navigation sidebar (Services, Doctors, Contacts, Appointments, Reviews, Gallery) + analytics stats.
  - CRUD tables & forms for all tables.

### 🔄 Step 4: Swap Public Frontend Data Sources
- Update server side fetches (using direct Prisma client query since they are Server Components) in:
  - `src/app/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/about/page.tsx`
- We will construct fallback seeding so if the database is clean, default static arrays are loaded automatically.

### 📘 Step 5: Update AGENTS.md
- Append architectural specifications for all subsequent development.

---

## Verification Plan

### Automated Tests
- Build verification: `npm run build`
- Type checking: `npm run lint`

### Manual Verification
- Test login with valid/invalid credentials.
- Perform a full CRUD lifecycle for a Service, Doctor, and Review.
- Submit a contact query and confirm it reflects in the dashboard.
- Book an appointment for a specific service and check relations in local SQLite.
