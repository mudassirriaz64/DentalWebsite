'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface HeaderFooterWrapperProps {
  children: React.ReactNode;
}

export default function HeaderFooterWrapper({ children }: HeaderFooterWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen flex flex-col w-full bg-bg-alt">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col w-full">{children}</main>
      <Footer />
    </>
  );
}
