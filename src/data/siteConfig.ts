import { ClinicConfig } from '@/types';

export const siteConfig: ClinicConfig = {
  name: 'Dental Cosmetics & Implant Centre',
  shortName: 'Dental Cosmetics',
  tagline: 'Crafting Beautiful, Healthy Smiles with Precision Cosmetic & Implant Dentistry',
  description: 'Welcome to Dental Cosmetics & Implant Centre, a state-of-the-art cosmetic dentistry and dental implant practice. We specialize in smile makeovers, porcelain veneers, dental implants, teeth whitening, and full mouth rehabilitation.',
  contact: {
    phone: '+1 (555) 234-5678',
    phoneFormatted: 'tel:+15552345678',
    email: 'info@dentalcosmetics.com',
    address: '123 Aesthetic Avenue, Suite 100, Smile City, SC 12345',
    addressMapUrl: 'https://maps.google.com',
    workingHours: [
      { days: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
      { days: 'Saturday', hours: '9:00 AM - 2:00 PM' },
      { days: 'Sunday', hours: 'Closed' }
    ]
  },
  socialLinks: {
    facebook: 'https://www.facebook.com/p/Dental-Cosmetics-and-Implant-Centre-I-8-MarkazIslamabad-100064120326094/'
  }
};
