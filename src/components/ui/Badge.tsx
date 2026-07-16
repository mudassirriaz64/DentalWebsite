import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  themeColor?: 'primary' | 'accent' | 'dark';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  themeColor = 'primary',
  ...props
}) => {
  const colorStyles = {
    primary: 'bg-primary-light text-primary border-primary/20',
    accent: 'bg-accent-light text-accent border-accent/20',
    dark: 'bg-slate-100 text-dark border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border',
        colorStyles[themeColor],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
