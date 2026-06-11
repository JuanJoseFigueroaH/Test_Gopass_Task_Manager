'use client';

import { ReactNode } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button/Button';

interface TasksTemplateProps {
  projectName: string;
  projectDescription?: string;
  onBackClick: () => void;
  onCreateClick: () => void;
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

export function TasksTemplate({
  projectName,
  projectDescription,
  onBackClick,
  onCreateClick,
  isLoading,
  isEmpty,
  emptyMessage,
  children,
}: TasksTemplateProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBackClick}
          className="p-2 hover:bg-gopass-black-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{projectName}</h2>
          {projectDescription && (
            <p className="text-gray-400">{projectDescription}</p>
          )}
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
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
            Create Task
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
