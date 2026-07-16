export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface WorkingHours {
  days: string;
  hours: string;
}

export interface ClinicConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  contact: {
    phone: string;
    phoneFormatted: string;
    email: string;
    address: string;
    addressMapUrl: string;
    workingHours: WorkingHours[];
  };
  socialLinks: SocialLinks;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  slug: string;
  iconName: string;
  imagePath?: string;
  variant?: 'large-image-card' | 'dark-teal-card' | 'white-card' | 'accent-pink-card';
  ctaLabel?: string;
  bullets?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  bio: string;
  imagePath: string;
  education?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  role: 'department-head' | 'core-team' | 'visionary';
  title: string;
  bio: string;
  imagePath: string;
  specialties?: string[];
  education?: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  rating: number;
  text: string;
  date?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface StatItem {
  id: string;
  value: string; // e.g. "15+" or "99%"
  numericValue: number; // for animations
  label: string;
  description: string;
}
