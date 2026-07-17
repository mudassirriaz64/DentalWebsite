import type { Metadata } from 'next';
import { Manrope, Libre_Caslon_Text } from 'next/font/google';
import { siteConfig } from '@/data/siteConfig';
import HeaderFooterWrapper from '@/components/layout/HeaderFooterWrapper';
import './globals.css';

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Libre_Caslon_Text({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Cosmetic Dentistry',
    'Dental Implants',
    'Smile Makeovers',
    'Porcelain Veneers',
    'Teeth Whitening',
    'Dental Clinic',
    'Implants Practice',
    'Dental Cosmetics',
  ],
  authors: [{ name: 'Dental Cosmetics & Implant Centre' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col antialiased text-foreground bg-bg font-sans">
        <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
      </body>
    </html>
  );
}
