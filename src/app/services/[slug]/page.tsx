import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getServices } from '@/data/services';
import ServiceDetailClient from '@/components/sections/services/ServiceDetailClient';

interface DynamicServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Dental Cosmetics & Implant Centre',
      description: 'The requested dental service could not be found.',
    };
  }

  return {
    title: `${service.title} - Dental Cosmetics & Implant Centre`,
    description: service.shortDescription || service.description || `Learn more about ${service.title} at Dental Cosmetics & Implant Centre.`,
  };
}

export async function generateStaticParams() {
  const allServices = await getServices();
  return allServices.map((s) => ({
    slug: s.slug,
  }));
}

export default async function ServiceDetailPage({ params }: DynamicServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
