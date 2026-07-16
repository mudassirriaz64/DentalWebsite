export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface TechFeature {
  title: string;
  description: string;
  style: 'large-image-card' | 'light-blue-card' | 'pink-card' | 'gray-card';
}


export const milestones: Milestone[] = [
  {
    year: '1998',
    title: 'The Foundation',
    description:
      'Founded by Dr. Elena Sterling, our clinic began with a singular vision: to bring world-class cosmetic dentistry to a personalized, boutique setting.',
  },
  {
    year: '2012',
    title: 'Tech Integration',
    description:
      'We pioneered the integration of 3D digital imaging and robotic surgical guides, setting a new standard for implant precision in the region.',
  },
  {
    year: '2024',
    title: 'Modern Heights',
    description:
      'Today, we are a multi-disciplinary center recognized for Excellence in Every Smile, serving over 15,000 patients with bespoke care.',
  },
];

export const techFeatures: TechFeature[] = [
  {
    title: '3D Digital Impressions',
    description:
      'Eliminating uncomfortable molds with micron-perfect digital scans for crown and bridge work.',
    style: 'large-image-card',
  },
  {
    title: 'Laser Dentistry',
    description:
      'Minimally invasive soft tissue procedures that reduce bleeding and accelerate healing times significantly.',
    style: 'light-blue-card',
  },
  {
    title: 'AI-Driven Diagnosis',
    description: 'Early detection of potential issues using neural-network analysis.',
    style: 'pink-card',
  },
  {
    title: 'Robotic Surgery',
    description: 'Pinpoint accuracy for complex implant placements.',
    style: 'gray-card',
  },
];

