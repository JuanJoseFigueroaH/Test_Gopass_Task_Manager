'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { Project } from '@/domain/entities/project.entity';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: { name: string; description?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Project Name"
        placeholder="Enter project name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors({});
        }}
        error={errors.name}
      />
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description (optional)
        </label>
        <textarea
          className="w-full px-4 py-2 bg-gopass-black-700 border border-gopass-black-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gopass-green-500 focus:border-transparent transition-all duration-200 resize-none"
          rows={3}
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {project ? 'Update' : 'Create'} Project
        </Button>
      </div>
    </form>
  );
}
