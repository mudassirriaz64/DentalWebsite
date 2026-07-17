import React from 'react';
import { cn } from '@/lib/utils';
import Badge from './Badge';

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  highlightedText?: string;
  highlightColor?: 'primary' | 'accent' | 'teal-clean';
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  showDots?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  highlightedText,
  highlightColor = 'accent',
  subtitle,
  align = 'center',
  showDots = true,
  className,
  ...props
}) => {
  const alignmentStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center justify-center',
    right: 'text-right items-end',
  };

  const renderTitle = () => {
    if (!highlightedText || !title.includes(highlightedText)) {
      return (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-dark leading-tight tracking-tight">
          {title}
        </h2>
      );
    }

    const parts = title.split(highlightedText);

    if (highlightColor === 'teal-clean') {
      return (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-[#121C2C] leading-tight tracking-tight">
          {parts[0]}
          <span className="text-primary">
            {highlightedText}
          </span>
          {parts[1]}
        </h2>
      );
    }

    const highlightClass = highlightColor === 'primary' ? 'text-primary' : 'text-accent';

    return (
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-dark leading-tight tracking-tight">
        {parts[0]}
        <span className={cn('relative inline-block px-1', highlightClass)}>
          {highlightedText}
          <span
            className={cn(
              'absolute bottom-1 left-0 w-full h-[6px] sm:h-[8px] rounded-full opacity-35 -z-10',
              highlightColor === 'primary' ? 'bg-primary' : 'bg-accent'
            )}
          />
        </span>
        {parts[1]}
      </h2>
    );
  };

  return (
    <div
      className={cn('flex flex-col w-full max-w-3xl', alignmentStyles[align], className)}
      {...props}
    >
      {eyebrow && (
        <Badge themeColor="accent" className="mb-4 font-sans text-xs tracking-[1.6px] font-medium py-1 px-3.5">
          {eyebrow}
        </Badge>
      )}

      {renderTitle()}

      {showDots && (
        <div className="flex items-center gap-2 mt-4 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="w-10 h-2 rounded-full bg-primary/20" />
        </div>
      )}

      {subtitle && (
        <p className="text-base sm:text-lg text-body-text leading-relaxed mt-4 max-w-2xl font-sans font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
