'use client';

import { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/atoms/Button/Button';

interface ProjectsTemplateProps {
  title: string;
  subtitle: string;
  onCreateClick: () => void;
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

export function ProjectsTemplate({
  title,
  subtitle,
  onCreateClick,
  isLoading,
  isEmpty,
  emptyMessage,
  children,
}: ProjectsTemplateProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gopass-green-500" />
        </div>
      ) : isEmpty ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">{emptyMessage}</p>
          <Button onClick={onCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      )}
    </div>
  );
}
