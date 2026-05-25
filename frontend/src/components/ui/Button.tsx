import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import type { HTMLMotionProps, TargetAndTransition } from 'framer-motion';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantInitial: Record<string, TargetAndTransition> = {
  primary:   { backgroundColor: 'rgba(15,23,42,1)',    color: 'rgba(255,255,255,1)' },
  secondary: { backgroundColor: 'rgba(241,245,249,1)', color: 'rgba(15,23,42,1)' },
  outline:   { backgroundColor: 'rgba(0,0,0,0)',       color: 'rgba(255,255,255,1)' },
  ghost:     { backgroundColor: 'rgba(0,0,0,0)',       color: 'rgba(255,255,255,1)' },
};

const variantHover: Record<string, TargetAndTransition> = {
  primary:   { backgroundColor: 'rgba(30,41,59,1)',    transition: { duration: 0.2 } },
  secondary: { backgroundColor: 'rgba(226,232,240,1)', transition: { duration: 0.2 } },
  outline:   { backgroundColor: 'rgba(255,255,255,0.07)', transition: { duration: 0.2 } },
  ghost:     { backgroundColor: 'rgba(255,255,255,0.1)',  transition: { duration: 0.2 } },
};

const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md';

const sizes = {
  sm: 'px-4 h-9 text-sm',
  md: 'px-6 h-10 text-sm',
  lg: 'px-8 h-12 text-base leading-6',
};

const borders: Record<string, string> = {
  primary:   '',
  secondary: '',
  outline:   'border border-white/30',
  ghost:     '',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        initial={variantInitial[variant]}
        whileHover={disabled ? {} : variantHover[variant]}
        whileTap={disabled ? {} : { scale: 0.97 }}
        disabled={disabled}
        className={cn(
          baseStyles,
          borders[variant],
          sizes[size],
          'focus:outline-none focus:ring-2 focus:ring-white/20',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
