import { Service } from '@/types';
import prisma from '@/lib/prisma';

export const services: Service[] = [
  {
    id: 'teeth-whitening',
    title: 'Teeth Whitening',
    shortDescription: 'Professional take-home whitening treatment to brighten your smile safely and gradually.',
    description:
      'Over time, teeth naturally pick up stains from coffee, tea, tobacco, and everyday food and drink. Our take-home whitening treatment uses a professional-grade whitening gel applied with custom-fitted trays, allowing you to brighten your smile gradually and safely from the comfort of your own home. Unlike over-the-counter kits, our formula is calibrated by your dentist to minimize sensitivity while delivering noticeably whiter results within one to two weeks of consistent use. A quick consultation ensures your teeth and gums are healthy enough for whitening before we get started.',
    slug: 'teeth-whitening',
    iconName: 'Sparkles',
    featured: true,
    bullets: ['Safe & Gentle', 'Visible Results in Days'],
  },
  {
    id: 'scaling',
    title: 'Scaling',
    shortDescription: 'Thorough removal of plaque and tartar buildup to keep your teeth and gums healthy.',
    description:
      "Plaque and tartar build up on teeth over time, even with regular brushing, especially in hard-to-reach areas along the gumline. Scaling is a professional deep-cleaning procedure that removes this buildup using specialized dental instruments, reaching areas a toothbrush simply can't. Regular scaling — typically recommended every six months — helps prevent gum disease, cavities, and bad breath, while keeping your teeth looking and feeling their cleanest. It's a foundational part of good long-term oral health, not just a cosmetic treatment.",
    slug: 'scaling',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Deep Cleaning', 'Prevents Gum Disease'],
  },
  {
    id: 'polishing',
    title: 'Polishing',
    shortDescription: 'A smooth, polished finish that removes surface stains and leaves teeth feeling fresh.',
    description:
      'Polishing is typically performed right after scaling and focuses on smoothing the surface of your teeth, removing minor surface stains and any remaining plaque residue. Using a gentle polishing paste and rotating tool, this step leaves your teeth feeling exceptionally smooth and looking naturally brighter. It also makes it harder for plaque to stick to your teeth in the days following your visit, extending the benefit of your cleaning appointment.',
    slug: 'polishing',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Removes Surface Stains', 'Smooth Finish'],
  },
  {
    id: 'teeth-whitening-bleaching-light',
    title: 'Teeth Whitening (Bleaching Light)',
    shortDescription: 'In-office laser/light-activated whitening for faster, more dramatic brightening in a single visit.',
    description:
      'For patients who want faster, more dramatic results, our in-office light-activated whitening treatment accelerates the whitening process using a specialized bleaching light combined with a professional-strength whitening gel. In a single office visit, most patients see several shades of improvement — a noticeable difference compared to take-home kits alone. This treatment is ideal ahead of a special occasion or for anyone who wants visible results without weeks of daily maintenance. Our team monitors your comfort throughout to keep the process gentle on your teeth and gums.',
    slug: 'teeth-whitening-bleaching-light',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Same-Day Results', 'Light-Activated Formula'],
  },
  {
    id: 'filling',
    title: 'Filling',
    shortDescription: 'Durable, tooth-colored fillings to restore teeth affected by decay or minor damage.',
    description:
      'When a tooth is affected by decay, chipping, or minor fracture, a filling restores its shape, strength, and function. We use tooth-colored composite materials that blend seamlessly with your natural teeth, so the repair is virtually invisible. The affected area is carefully cleaned and prepared before the filling material is applied and shaped to match your bite. Fillings are one of the most common and effective ways to stop decay from progressing and to protect the tooth from further damage.',
    slug: 'filling',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Tooth-Colored Material', 'Long-Lasting'],
  },
  {
    id: 'root-canal-treatment',
    title: 'Root Canal Treatment',
    shortDescription: 'Expert treatment to relieve pain and save infected or badly damaged teeth from extraction.',
    description:
      "When decay or infection reaches the inner pulp of a tooth, a root canal is often the best way to relieve pain and save the tooth from extraction. During the procedure, the infected or damaged pulp is carefully removed, the interior of the tooth is cleaned and disinfected, and it's then sealed to prevent future infection. Modern root canal treatment is far more comfortable than its reputation suggests — most patients report feeling immediate relief from the pain that brought them in, with the procedure itself performed under local anesthesia for comfort.",
    slug: 'root-canal-treatment',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Pain Relief', 'Saves Your Natural Tooth'],
  },
  {
    id: 'simple-extraction',
    title: 'Simple Extraction',
    shortDescription: 'Gentle, straightforward removal of a visible, easily accessible tooth.',
    description:
      "A simple extraction is used for teeth that are fully visible above the gumline and not significantly damaged or impacted. Using local anesthesia to ensure comfort, the tooth is gently loosened and removed using specialized instruments. This is typically a quick, straightforward procedure with minimal recovery time, often recommended for severely decayed teeth that can't be saved with a filling or crown, or to make room for orthodontic treatment.",
    slug: 'simple-extraction',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Quick Procedure', 'Minimal Discomfort'],
  },
  {
    id: 'surgical-extraction',
    title: 'Surgical Extraction',
    shortDescription: 'Careful surgical removal for teeth that are broken, impacted, or not easily accessible.',
    description:
      'Surgical extraction is required when a tooth is broken at the gumline, has not fully erupted, or is positioned in a way that makes it difficult to remove with a standard extraction. This procedure may involve a small incision in the gum tissue to access the tooth safely. Our team takes extra care to ensure your comfort throughout, using appropriate anesthesia and precise technique, followed by clear aftercare guidance to support smooth healing.',
    slug: 'surgical-extraction',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Precision Technique', 'Experienced Care'],
  },
  {
    id: 'wisdom-tooth-extraction',
    title: 'Wisdom Tooth Extraction',
    shortDescription: 'Safe removal of impacted or problematic wisdom teeth to prevent pain and crowding.',
    description:
      "Wisdom teeth often don't have enough room to emerge properly, leading to impaction, crowding, pain, or infection. Removing problematic wisdom teeth — usually recommended in the late teens to early twenties, though it can be done at any age — helps prevent these complications before they become more serious. We evaluate the position of your wisdom teeth using imaging, discuss the best approach for your specific case, and guide you through a comfortable recovery process afterward.",
    slug: 'wisdom-tooth-extraction',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Prevents Crowding', 'Relieves Impaction Pain'],
  },
  {
    id: 'dental-implants',
    title: 'Dental Implants',
    shortDescription: 'Permanent, natural-looking replacement for missing teeth using titanium implant posts.',
    description:
      "Dental implants are the gold standard for replacing missing teeth, offering a permanent, natural-looking, and fully functional solution. A titanium implant post is placed into the jawbone, where it fuses naturally over time to create a stable foundation — much like a natural tooth root. A custom-crafted crown is then attached, matched precisely to the color and shape of your surrounding teeth. Unlike dentures or bridges, implants don't rely on neighboring teeth for support and are built to last for decades with proper care.",
    slug: 'dental-implants',
    iconName: 'Sparkles',
    featured: true,
    bullets: ['Permanent Solution', 'Natural Look & Feel'],
  },
  {
    id: 'removable-denture',
    title: 'Removable Denture',
    shortDescription: 'Custom-fitted removable dentures to restore your smile and everyday function.',
    description:
      'For patients missing several or all of their teeth, removable dentures offer a comfortable, custom-fitted solution to restore both appearance and everyday function like eating and speaking. Each denture is carefully molded and shaped to fit the unique contours of your mouth, ensuring a secure and comfortable fit. We offer both partial dentures (for patients with some remaining natural teeth) and full dentures, with adjustments available as needed to maintain the best possible fit over time.',
    slug: 'removable-denture',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Custom Fit', 'Restores Chewing Function'],
  },
  {
    id: 'braces',
    title: 'Braces',
    shortDescription: 'Traditional wire braces to gradually straighten teeth and correct bite alignment.',
    description:
      'Traditional metal braces remain one of the most effective ways to correct misaligned teeth, bite issues, and spacing problems, especially for more complex orthodontic cases. Braces use a system of brackets and wires to gradually shift teeth into their ideal position over the course of treatment. Suitable for both teens and adults, braces are a well-established, highly reliable option backed by decades of proven results, with regular adjustment visits to track your progress along the way.',
    slug: 'braces',
    iconName: 'Sparkles',
    featured: true,
    bullets: ['Proven Results', 'Suitable for All Ages'],
  },
  {
    id: 'bridges-crown',
    title: 'Bridges / Crown',
    shortDescription: 'Custom crowns and bridges to restore damaged teeth or replace gaps with a natural-looking finish.',
    description:
      "Crowns and bridges are custom-crafted restorations used to repair damaged teeth or replace one or more missing teeth. A crown covers and protects a tooth that's been weakened by decay, fracture, or a root canal, restoring its strength and appearance. A bridge, meanwhile, spans the gap left by a missing tooth by anchoring to the adjacent teeth. Both are designed and shaded to blend naturally with your smile, restoring full chewing function and preventing surrounding teeth from shifting out of place.",
    slug: 'bridges-crown',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Natural Appearance', 'Restores Full Function'],
  },
  {
    id: 'gum-disease-treatment',
    title: 'Gum Disease Treatment',
    shortDescription: 'Targeted treatment to manage and reverse early gum disease, protecting your long-term oral health.',
    description:
      'Healthy gums are the foundation of a healthy smile, but gum disease — from early gingivitis to more advanced periodontitis — can quietly progress if left untreated, eventually leading to tooth loss. Our gum disease treatment focuses on identifying the stage of disease and addressing it through deep cleaning, targeted therapy, and personalized home-care guidance. Early intervention is key, and regular checkups allow us to catch and treat gum issues before they become more serious.',
    slug: 'gum-disease-treatment',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['Protects Gum Health', 'Prevents Tooth Loss'],
  },
  {
    id: 'clear-aligners',
    title: 'Clear Aligners',
    shortDescription: 'Discreet, removable aligners to straighten teeth without traditional metal braces.',
    description:
      'Clear aligners offer a discreet, comfortable alternative to traditional braces for straightening teeth and correcting mild-to-moderate alignment issues. Using a series of custom-made, virtually invisible trays, your teeth are gradually shifted into place, with each aligner worn for a set period before moving to the next in the series. Removable for eating, brushing, and special occasions, clear aligners are a popular choice for adults and teens who want effective results without the visibility of metal braces.',
    slug: 'clear-aligners',
    iconName: 'Sparkles',
    featured: true,
    bullets: ['Nearly Invisible', 'Removable & Convenient'],
  },
  {
    id: 'veneers',
    title: 'Veneers',
    shortDescription: 'Thin, custom-made shells that instantly transform the shape, color, and symmetry of your smile.',
    description:
      "Veneers are ultra-thin, custom-crafted shells bonded to the front surface of your teeth, instantly transforming their shape, size, color, and symmetry. Whether addressing chips, gaps, discoloration, or minor misalignment, veneers offer one of the most dramatic and immediate smile transformations available in cosmetic dentistry. Each veneer is precisely shaded and shaped to complement your facial features, giving you a natural, radiant smile that's built to last for years with proper care.",
    slug: 'veneers',
    iconName: 'Sparkles',
    featured: true,
    bullets: ['Instant Smile Makeover', 'Custom-Matched Shade'],
  },
  {
    id: 'x-ray-facility',
    title: 'X-Ray Facility',
    shortDescription: 'On-site digital X-ray imaging for accurate diagnosis and treatment planning.',
    description:
      "Accurate diagnosis starts with a clear picture — literally. Our on-site digital X-ray facility allows us to examine what's happening beneath the surface: hidden decay, bone health, impacted teeth, infections, and more, all without the wait or inconvenience of an outside referral. Digital X-rays also use significantly less radiation than traditional film X-rays, making them a fast, safe, and essential part of thorough treatment planning for nearly every procedure we offer.",
    slug: 'x-ray-facility',
    iconName: 'Sparkles',
    featured: false,
    bullets: ['On-Site & Convenient', 'Accurate Diagnostics'],
  },
];

export async function getServices(): Promise<Service[]> {
  try {
    const dbServices = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (dbServices.length > 0) {
      return dbServices.map((service) => ({
        id: service.id,
        title: service.title,
        shortDescription: service.shortDescription,
        description: service.description,
        slug: service.slug,
        iconName: service.iconName,
        imagePath: service.imagePath || undefined,
        variant: service.variant as Service['variant'],
        ctaLabel: service.ctaLabel || undefined,
        bullets: JSON.parse(service.bulletsJson || '[]'),
        featured: service.featured,
      }));
    }
  } catch (error) {
    console.warn('Database fetch failed in getServices, falling back to static data:', error);
  }

  return services;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const dbService = await prisma.service.findUnique({
      where: { slug },
    });

    if (dbService) {
      return {
        id: dbService.id,
        title: dbService.title,
        shortDescription: dbService.shortDescription,
        description: dbService.description,
        slug: dbService.slug,
        iconName: dbService.iconName,
        imagePath: dbService.imagePath || undefined,
        variant: dbService.variant as Service['variant'],
        ctaLabel: dbService.ctaLabel || undefined,
        bullets: JSON.parse(dbService.bulletsJson || '[]'),
        featured: dbService.featured,
      };
    }
  } catch (error) {
    console.warn(`Database fetch failed for slug ${slug}, falling back to static data:`, error);
  }

  return services.find((s) => s.slug === slug) || null;
}
