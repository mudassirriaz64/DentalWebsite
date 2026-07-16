# Dental Cosmetics & Implant Centre Website

A premium web experience built for **Dental Cosmetics & Implant Centre**, specializing in cosmetic dentistry and advanced dental implants.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
/src
  /app
    layout.tsx               # Global wrapper layout (fonts, header, footer, SEO metadata)
    globals.css              # Custom HSL design tokens, keyframes & animations, utility classes
    page.tsx                 # Home landing page entry
  /components
    /ui                      # Pure reusable primitive components (Button, Badge, Card, etc.)
    /layout                  # Site-wide layout skeletons (Header, Footer, MobileMenu drawer)
    /sections                # Page-specific sections (e.g. /sections/home, /sections/services)
    /shared                  # Composite helper components used across multiple sections (ServiceCard, ConsultationForm, etc.)
  /lib                       # Helper utilities (cn tailwind-merge helper, validation schemas, variants)
  /types                     # Shared TypeScript interfaces (Service, TeamMember, FAQItem, NavLink, etc.)
  /data                      # Immutable content databases as typed arrays (siteConfig.ts, services.ts, team.ts, etc.)
/public
  /images
    /home, /our-team, /services, /gallery   # Assets divided by layout context
  /icons                     # Graphic assets and svgs
```

---

## 🏷️ Coding Standards & Naming Conventions

1. **Component Files**: Use `PascalCase.tsx` (e.g., `Button.tsx`, `SectionHeading.tsx`).
2. **Utilities & Data Files**: Use `camelCase.ts` (e.g., `siteConfig.ts`, `navLinks.ts`).
3. **Folder Structures**: Use `kebab-case` for paths, dynamic routes, and asset folders (e.g., `our-team`, `services`).
4. **Single Responsibility**: Do not place multiple component definitions in a single file. Break files into dedicated logical modules.
5. **No Placeholders**: Fetch all component parameters from the database arrays in `/data` instead of hardcoding text values directly in markup.
6. **TypeScript Strictness**: Avoid the use of `any` at all costs. Maintain explicitly defined interfaces for props and callbacks in `/types`.

---

## 🚀 How to Add a New Page and Section

### Step 1: Create the Page Route
Add a route folder inside `src/app/` containing a `page.tsx`:
```tsx
// src/app/services/page.tsx
import React from 'react';
import Container from '@/components/ui/Container';
import ServicesGrid from '@/components/sections/services/ServicesGrid';

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-16">
      <Container>
        <ServicesGrid />
      </Container>
    </div>
  );
}
```

### Step 2: Create Page-Specific Sections
Create page sections inside a subdirectory under `src/components/sections/`:
```tsx
// src/components/sections/services/ServicesGrid.tsx
import React from 'react';
import { services } from '@/data/services';
import SectionHeading from '@/components/ui/SectionHeading';

export default function ServicesGrid() {
  return (
    <section className="flex flex-col items-center gap-12">
      <SectionHeading
        eyebrow="Specialties"
        title="Our Specialized Dental Procedures"
        highlightedText="Dental Procedures"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div key={service.id}>{service.title}</div>
        ))}
      </div>
    </section>
  );
}
```

---

## 🏃 Local Development

First, run the development server:
```bash
npm run dev
```

Build and scan checks:
```bash
# Production bundling verification
npm run build

# Code health analysis
npm run lint
```
