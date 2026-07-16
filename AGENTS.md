<!-- BEGIN:nextjs-agent-rules -->
## 1. Project Context

- **Site**: Marketing/informational website for "Dental Cosmetics & Implant Centre"
- **Stack**: Next.js 14+ (App Router), TypeScript (strict), Tailwind CSS, Framer Motion
- **Audience**: Prospective and existing dental patients — copy and UI should feel calm,
  premium, trustworthy, and low-anxiety (this is healthcare, not e-commerce hype).
- Never introduce generic "hospital" language, imagery references, or terminology
  (e.g. "patients admitted," "surgery ward"). Keep everything scoped to cosmetic dentistry,
  implants, and general dental care.

---

## 2. Folder & File Structure

Follow the structure established in `/src` — do not invent parallel structures.
/src/app            → routes only (page.tsx, layout.tsx per route)
/src/components/ui        → generic reusable primitives (Button, Card, Input, Accordion...)
/src/components/layout    → Header, Footer, Navbar, MobileMenu
/src/components/sections  → page-specific sections, one subfolder per page
/src/components/shared    → composite components reused across 2+ pages
/src/data            → typed static content arrays (never hardcode repeated content in JSX)
/src/types           → shared TypeScript interfaces/types
/src/lib             → utilities, constants, animation variants, validation helpers
/public/images/<page-name>  → images scoped per page

- Before creating a new component, **check if something similar already exists** in `/ui`
  or `/shared`. Extend or reuse it rather than duplicating.
- Every new route gets its own `/components/sections/<route-name>/` folder.
- `page.tsx` files should only compose section components — no raw markup, no business logic.

---

## 3. Component Rules

- **Single responsibility**: one component = one job. If a section component exceeds ~150
  lines or mixes multiple visual concerns, split it.
- **No repeated JSX**: if the same markup shape appears twice (a card, a list item, a stat
  block), extract it into a component and map over data.
- **All content in data files, not inline**: nav links, footer links, services, testimonials,
  FAQs, stats, team members — all live in `/src/data/*.ts` as typed arrays. Components import
  and map over them.
- **Full TypeScript typing** on all props — no `any`, no implicit `any`. Define shared types
  in `/src/types`.
- **Props over duplication**: prefer a flexible component with variant props (e.g.
  `<Button variant="primary" | "outline" | "accent">`) over separate near-identical
  components.
- Use `next/image` for all images (never raw `<img>`), with explicit `width`/`height` or
  `fill` + a sized parent.
- Use `next/link` for all internal navigation.

---

## 4. Styling Rules

- **Tailwind only** — no raw CSS files except `globals.css` for resets/font-face/base
  layer. No inline `style={{}}` unless truly dynamic (e.g. computed carousel offsets).
- All colors, fonts, spacing, radii, and shadows must come from the Tailwind theme config
  (`tailwind.config.ts`) via design tokens — never hardcode hex codes or arbitrary px values
  in component files. If a token doesn't exist yet, add it to the theme config first.
- Reuse the established design tokens (see design reference doc) — deep teal primary, accent
  rose/crimson, mint highlights, soft teal-tinted shadows, pill-shaped buttons, generous
  border-radius on cards.
- **Mobile-first**: write base styles for mobile, layer up with `sm:`/`md:`/`lg:`/`xl:`
  breakpoints. Every section must be tested mentally at 375px, 768px, 1280px+.
- Maintain consistent vertical rhythm between sections (use the spacing scale from the design
  tokens, don't eyeball arbitrary padding).

---

## 5. Layout Rules

- Never replicate Figma's absolute pixel positioning. Any "pixel-perfect" layout data from
  Figma exports describes proportions and visual relationships, not literal CSS — rebuild
  using **CSS Grid or Flexbox** so it reflows responsively.
- Bento/asymmetric grids: use CSS Grid with named template areas, not `position: absolute`
  with fixed left/top offsets.
- Any layout that only works at one fixed viewport width is not acceptable — it must adapt
  down to mobile.

---

## 6. Animation Rules

- Use **Framer Motion** for all animation — no manual CSS keyframe hacks unless trivial
  (e.g. a simple hover transition, which can stay in Tailwind via `transition-*` classes).
- Scroll-triggered entrance animations: `whileInView` with `viewport={{ once: true }}`,
  subtle fade + slight upward slide (translateY 16–24px → 0). Keep duration short (0.4–0.6s),
  easing smooth (e.g. `ease-out`).
- Stagger children in grids/lists (services, stats, team cards) via `staggerChildren` in a
  parent `variants` object — don't animate each child with hardcoded individual delays.
- Hover micro-interactions: subtle scale (1.02–1.05) or lift (shadow + translateY -2px) on
  cards and buttons — never jarring or slow.
- Animate only `transform` and `opacity` for performance — avoid animating `width`, `height`,
  `top`, `left` directly (use layout animations or `height: auto` via Framer's `AnimatePresence`
  where needed, e.g. accordions).
- **Always respect `prefers-reduced-motion`** — wrap animation logic so it degrades to
  instant/no animation for users with that preference set.
- Don't over-animate: not every element needs motion. Prioritize hero, section entrances,
  cards, and interactive elements (accordion, carousel, forms). Body text and static labels
  don't need individual animations.

---

## 7. Accessibility

- Every interactive element must be keyboard-navigable and have visible focus states.
- All images need meaningful `alt` text (never empty unless purely decorative, in which case
  `alt=""`).
- Form inputs need associated `<label>` elements (visually hidden if design omits visible
  labels) and proper `aria-` attributes for validation errors.
- Maintain sufficient color contrast — check text-on-color-background combos against the
  token palette (e.g. don't put body-text-gray on light-blue backgrounds without checking
  contrast).
- Use semantic HTML: `<nav>`, `<header>`, `<footer>`, `<main>`, `<section>`, proper heading
  hierarchy (one `<h1>` per page, logical `<h2>`/`<h3>` nesting) — not `<div>` soup.

---

## 8. Content & Copy Rules

- Never invent medical claims, guarantees, or statistics not provided — flag placeholders
  clearly (e.g. `{/* TODO: confirm years of experience stat */}`) rather than inventing
  precise numbers.
- Keep CTAs action-oriented and reassuring ("Book a Free Consultation," not "Buy Now" /
  "Order").
- Avoid AI-sounding filler phrases in on-page copy ("Discover a world of...", "Unlock your
  potential...", em-dash-heavy sentences). Keep tone warm, professional, concise.

---

## 9. Forms

- All forms need client-side validation (required fields, email format, phone format) before
  any submission logic exists.
- Show clear success/error states — don't just clear the form silently.
- Until backend/API integration is set up, submissions should `console.log` the payload and
  show a success UI state — never fail silently or pretend to submit without feedback.

---

## 10. Before Finishing Any Task

- Confirm the component/file list you're about to create or modify before writing code, if
  the task is non-trivial (more than 1–2 files).
- Double-check no content, colors, spacing, or component logic is duplicated somewhere else
  in the codebase.
- Verify responsiveness mentally (mobile / tablet / desktop) for anything you build.
- Verify animations respect `prefers-reduced-motion` and don't jank on scroll.
- Do not silently skip requirements from the prompt — if something is ambiguous or an asset
  is missing, ask or flag it rather than guessing silently.
