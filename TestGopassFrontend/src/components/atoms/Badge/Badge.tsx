'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    success: 'bg-gopass-green-500/20 text-gopass-green-400 border-gopass-green-500',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    danger: 'bg-red-500/20 text-red-400 border-red-500',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500',
    default: 'bg-gray-500/20 text-gray-400 border-gray-500',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
