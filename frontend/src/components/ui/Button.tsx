import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all active:scale-95";
  
    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100",
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
      outline: "bg-transparent text-slate-900 border border-slate-900 hover:bg-slate-50 dark:text-white dark:border-white/30 dark:hover:bg-white/5",
      ghost: "bg-transparent text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
    };

    const sizes = {
      sm: 'px-4 h-9 text-sm',
      md: 'px-6 h-10 text-sm',
      lg: 'px-8 h-12 text-base leading-6' // 48px h, 32px px, 16px text-size (24px line-height) - Auth0 Spec
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          baseStyles,
          'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
          variants[variant],
          sizes[size],
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
