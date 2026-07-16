import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  themeColor?: 'primary' | 'accent' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  animateHover?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'solid',
      themeColor = 'primary',
      size = 'md',
      pill = true,
      animateHover = true,
      icon,
      iconPosition = 'right',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

    const shapeStyles = pill ? 'rounded-full' : 'rounded-md';

    const sizeStyles = {
      sm: 'text-xs px-4 py-2 gap-1.5',
      md: 'text-sm px-6 py-3 gap-2',
      lg: 'text-base px-8 py-4 gap-2.5',
    };

    const variantStyles = {
      solid: {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
        accent: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent',
        dark: 'bg-dark text-white hover:bg-dark-hover focus:ring-dark',
      },
      outline: {
        primary:
          'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary bg-transparent',
        accent:
          'border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent bg-transparent',
        dark:
          'border-2 border-dark text-dark hover:bg-dark hover:text-white focus:ring-dark bg-transparent',
      },
      ghost: {
        primary: 'text-primary hover:bg-primary-light focus:ring-primary bg-transparent',
        accent: 'text-accent hover:bg-accent-light focus:ring-accent bg-transparent',
        dark: 'text-dark hover:bg-slate-100 focus:ring-dark bg-transparent',
      },
    };

    const diagonalHoverClass =
      variant === 'solid' && animateHover ? 'btn-diagonal-stripe' : '';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          shapeStyles,
          sizeStyles[size],
          variantStyles[variant][themeColor],
          diagonalHoverClass,
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
