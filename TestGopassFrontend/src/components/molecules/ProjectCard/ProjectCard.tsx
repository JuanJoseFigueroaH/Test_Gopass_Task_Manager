'use client';

import { Project } from '@/domain/entities/project.entity';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Folder, Calendar, Trash2, Edit } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onClick }: ProjectCardProps) {
  return (
    <div
      className="bg-gopass-black-700 border border-gopass-black-500 rounded-xl p-6 hover:border-gopass-green-500 transition-all duration-200 cursor-pointer group"
      onClick={() => onClick(project)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gopass-green-500/20 rounded-lg">
            <Folder className="w-5 h-5 text-gopass-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-gopass-green-400 transition-colors">
              {project.name}
            </h3>
            <Badge variant={project.isActive ? 'success' : 'default'}>
              {project.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="p-2 hover:bg-gopass-black-600 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-400 hover:text-gopass-green-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="p-2 hover:bg-gopass-black-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
      {project.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        {project.tasks && (
          <span>{project.tasks.length} tasks</span>
        )}
      </div>
    </div>
  );
}
