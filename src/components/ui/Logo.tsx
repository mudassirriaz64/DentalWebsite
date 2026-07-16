import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // 'light' is raw transparent PNG; 'dark' frames in white badge for navy footer contrast
}

export const Logo: React.FC<LogoProps> = ({ className, variant = 'light' }) => {
  if (variant === 'dark') {
    return (
      <div
        className={cn(
          'w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md select-none flex-shrink-0',
          className
        )}
      >
        <Image
          src="/logo.png"
          alt="Dental Cosmetics Logo"
          width={36}
          height={36}
          priority
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn('relative w-12 h-12 select-none flex-shrink-0', className)}>
      <Image
        src="/logo.png"
        alt="Dental Cosmetics Logo"
        fill
        priority
        sizes="48px"
        className="object-contain"
      />
    </div>
  );
};

export default Logo;
