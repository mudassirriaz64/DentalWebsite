'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FounderSpotlightRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin?tab=doctors&view=spotlight');
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <p className="text-xs text-slate-500">Redirecting to Doctors → Founder Spotlight...</p>
    </div>
  );
}
