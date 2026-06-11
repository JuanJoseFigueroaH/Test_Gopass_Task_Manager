'use client';

import { useEffect, useState } from 'react';
import { MainTemplate } from '@/components/templates/MainTemplate/MainTemplate';
import { TasksTemplate } from '@/components/templates/TasksTemplate/TasksTemplate';
import { TaskCard } from '@/components/molecules/TaskCard/TaskCard';
import { Modal } from '@/components/molecules/Modal/Modal';
import { TaskForm } from '@/components/organisms/TaskForm/TaskForm';
import { Toast } from '@/components/atoms/Toast/Toast';
import { useTaskStore } from '@/application/stores/task.store';
import { Project, Task, TaskStatus } from '@/domain/entities/project.entity';

interface TasksPageProps {
  project: Project;
  onBack: () => void;
}

export function TasksPage({ project, onBack }: TasksPageProps) {
  const {
    tasks,
    isLoading,
    fetchTasksByProject,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchTasksByProject(project.id);
  }, [project.id, fetchTasksByProject]);

  const handleCreate = async (data: {
    title: string;
    projectId: string;
    description?: string;
    status?: TaskStatus;
    priority?: string;
    dueDate?: string;
  }) => {
    const result = await createTask(data as Parameters<typeof createTask>[0]);
    if (result.success) {
      showToast(result.message || 'Tarea creada exitosamente', 'success');
      setIsModalOpen(false);
    } else {
      showToast(result.message || 'Error al crear la tarea', 'error');
    }
  };

  const handleUpdate = async (data: {
    title: string;
    projectId: string;
    description?: string;
    status?: TaskStatus;
    priority?: string;
    dueDate?: string;
  }) => {
    if (editingTask) {
      const { projectId, ...updateData } = data;
      const result = await updateTask(editingTask.id, updateData);
      if (result.success) {
        showToast(result.message || 'Tarea actualizada exitosamente', 'success');
        setEditingTask(null);
        setIsModalOpen(false);
      } else {
        showToast(result.message || 'Error al actualizar la tarea', 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      const result = await deleteTask(id);
      if (result.success) {
        showToast(result.message || 'Tarea eliminada exitosamente', 'success');
      } else {
        showToast(result.message || 'Error al eliminar la tarea', 'error');
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    const result = await updateTask(id, { status });
    if (result.success) {
      showToast('Estado actualizado', 'success');
    } else {
      showToast(result.message || 'Error al actualizar el estado', 'error');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <MainTemplate>
      <TasksTemplate
        projectName={project.name}
        projectDescription={project.description}
        onBackClick={onBack}
        onCreateClick={() => setIsModalOpen(true)}
        isLoading={isLoading}
        isEmpty={tasks.length === 0}
        emptyMessage="No tasks yet. Create your first task!"
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </TasksTemplate>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          task={editingTask}
          projectId={project.id}
          onSubmit={editingTask ? handleUpdate : handleCreate}
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
