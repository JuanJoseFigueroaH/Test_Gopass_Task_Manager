'use client';

import { useEffect, useState } from 'react';
import { MainTemplate } from '@/components/templates/MainTemplate/MainTemplate';
import { ProjectsTemplate } from '@/components/templates/ProjectsTemplate/ProjectsTemplate';
import { ProjectCard } from '@/components/molecules/ProjectCard/ProjectCard';
import { Modal } from '@/components/molecules/Modal/Modal';
import { ProjectForm } from '@/components/organisms/ProjectForm/ProjectForm';
import { Toast } from '@/components/atoms/Toast/Toast';
import { useProjectStore } from '@/application/stores/project.store';
import { Project } from '@/domain/entities/project.entity';

interface ProjectsPageProps {
  onProjectSelect: (project: Project) => void;
}

export function ProjectsPage({ onProjectSelect }: ProjectsPageProps) {
  const {
    projects,
    isLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjectStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleCreate = async (data: { name: string; description?: string }) => {
    const result = await createProject(data);
    if (result.success) {
      showToast(result.message || 'Proyecto creado exitosamente', 'success');
      setIsModalOpen(false);
    } else {
      showToast(result.message || 'Error al crear el proyecto', 'error');
    }
  };

  const handleUpdate = async (data: { name: string; description?: string }) => {
    if (editingProject) {
      const result = await updateProject(editingProject.id, data);
      if (result.success) {
        showToast(result.message || 'Proyecto actualizado exitosamente', 'success');
        setEditingProject(null);
        setIsModalOpen(false);
      } else {
        showToast(result.message || 'Error al actualizar el proyecto', 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      const result = await deleteProject(id);
      if (result.success) {
        showToast(result.message || 'Proyecto eliminado exitosamente', 'success');
      } else {
        showToast(result.message || 'Error al eliminar el proyecto', 'error');
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <MainTemplate>
      <ProjectsTemplate
        title="Projects"
        subtitle="Manage your projects and tasks"
        onCreateClick={() => setIsModalOpen(true)}
        isLoading={isLoading}
        isEmpty={projects.length === 0}
        emptyMessage="No projects yet. Create your first project!"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={onProjectSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ProjectsTemplate>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'New Project'}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </MainTemplate>
  );
}
