'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/organisms/Header/Header';

interface MainTemplateProps {
  children: ReactNode;
}

export function MainTemplate({ children }: MainTemplateProps) {
  return (
    <div className="min-h-screen bg-gopass-black-900">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
