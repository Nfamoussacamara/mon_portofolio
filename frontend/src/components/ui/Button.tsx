import React, { useMemo } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import type { HTMLMotionProps, TargetAndTransition } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const getVariantInitial = (theme: 'light' | 'dark'): Record<string, TargetAndTransition> => ({
  primary:   { 
    backgroundColor: theme === 'light' ? 'rgb(59, 130, 246)' : 'rgba(15,23,42,1)',    
    color: '#ffffff' 
  },
  secondary: { backgroundColor: 'rgba(241,245,249,1)', color: 'rgba(15,23,42,1)' },
  outline:   { 
    backgroundColor: 'rgba(0,0,0,0)',       
    color: theme === 'light' ? 'rgb(37, 99, 235)' : 'var(--text-primary)' 
  },
  ghost:     { backgroundColor: 'rgba(0,0,0,0)',       color: 'var(--text-primary)' },
});

const getVariantHover = (theme: 'light' | 'dark'): Record<string, TargetAndTransition> => ({
  primary:   { 
    backgroundColor: theme === 'light' ? 'rgb(37, 99, 235)' : 'rgba(30,41,59,1)',    
    transition: { duration: 0.2 } 
  },
  secondary: { backgroundColor: 'rgba(226,232,240,1)', transition: { duration: 0.2 } },
  outline:   { backgroundColor: 'rgba(255,255,255,0.07)', transition: { duration: 0.2 } },
  ghost:     { backgroundColor: 'rgba(255,255,255,0.1)',  transition: { duration: 0.2 } },
});

const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-md';

const sizes = {
  sm: 'px-4 h-9 text-sm',
  md: 'px-6 h-10 text-sm',
  lg: 'px-8 h-12 text-base leading-6',
};

const borders: Record<string, string> = {
  primary:   '',
  secondary: '',
  outline:   'border border-[var(--border-card)]',
  ghost:     '',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const { theme } = useTheme();
    
    // Optimisation : Mémorisation des variantes pour éviter les recalculs inutiles
    const variantInitial = useMemo(() => getVariantInitial(theme), [theme]);
    const variantHover = useMemo(() => getVariantHover(theme), [theme]);

    return (
      <motion.button
        ref={ref}
        initial={variantInitial[variant]}
        whileHover={disabled || isLoading ? {} : variantHover[variant]}
        whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          borders[variant],
          variant === 'outline' && theme === 'light' && 'border-blue-500 text-blue-600',
          sizes[size],
          'focus:outline-none focus:ring-2 focus:ring-white/20',
          disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5 text-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children as React.ReactNode}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
