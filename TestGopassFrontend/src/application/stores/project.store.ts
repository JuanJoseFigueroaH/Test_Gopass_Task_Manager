import { create } from 'zustand';
import { Project } from '@/domain/entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from '@/domain/ports/project.repository.port';
import { socketClient } from '@/infrastructure/websocket/socket.client';
import {
  getGetProjectsUseCase,
  getGetProjectByIdUseCase,
  getCreateProjectUseCase,
  getUpdateProjectUseCase,
  getDeleteProjectUseCase,
} from '@/core/di/container';
import { Result } from '@/domain/types/result';

interface OperationResult {
  success: boolean;
  message?: string;
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (data: CreateProjectDto) => Promise<OperationResult>;
  updateProject: (id: string, data: UpdateProjectDto) => Promise<OperationResult>;
  deleteProject: (id: string) => Promise<OperationResult>;
  setSelectedProject: (project: Project | null) => void;
  initWebSocket: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    const result = await getGetProjectsUseCase().execute();
    if (Result.isOk(result)) {
      set({ projects: result.data.data, isLoading: false });
    } else {
      set({ error: result.error.message, isLoading: false });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    const result = await getGetProjectByIdUseCase().execute(id);
    if (Result.isOk(result)) {
      set({ selectedProject: result.data, isLoading: false });
    } else {
      set({ error: result.error.message, isLoading: false });
    }
  },

  createProject: async (data: CreateProjectDto): Promise<OperationResult> => {
    set({ isLoading: true, error: null });
    const result = await getCreateProjectUseCase().execute(data);
    if (Result.isOk(result)) {
      set((state: ProjectState) => ({
        projects: [result.data, ...state.projects],
        isLoading: false,
      }));
      return { success: true, message: 'Proyecto creado exitosamente' };
    } else {
      set({ error: result.error.message, isLoading: false });
      return { success: false, message: result.error.message };
    }
  },

  updateProject: async (id: string, data: UpdateProjectDto): Promise<OperationResult> => {
    set({ isLoading: true, error: null });
    const result = await getUpdateProjectUseCase().execute(id, data);
    if (Result.isOk(result)) {
      const updatedProject = result.data;
      set((state: ProjectState) => ({
        projects: state.projects.map((p: Project) => (p.id === id ? updatedProject : p)),
        selectedProject: state.selectedProject?.id === id ? updatedProject : state.selectedProject,
        isLoading: false,
      }));
      return { success: true, message: 'Proyecto actualizado exitosamente' };
    } else {
      set({ error: result.error.message, isLoading: false });
      return { success: false, message: result.error.message };
    }
  },

  deleteProject: async (id: string): Promise<OperationResult> => {
    set({ isLoading: true, error: null });
    const result = await getDeleteProjectUseCase().execute(id);
    if (Result.isOk(result)) {
      set((state: ProjectState) => ({
        projects: state.projects.filter((p: Project) => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false,
      }));
      return { success: true, message: 'Proyecto eliminado exitosamente' };
    } else {
      set({ error: result.error.message, isLoading: false });
      return { success: false, message: result.error.message };
    }
  },

  setSelectedProject: (project: Project | null) => {
    set({ selectedProject: project });
  },

  initWebSocket: () => {
    socketClient.connect();

    socketClient.on('project:created', (project: Project) => {
      set((state: ProjectState) => ({
        projects: [project, ...state.projects.filter((p: Project) => p.id !== project.id)],
      }));
    });

    socketClient.on('project:updated', (project: Project) => {
      set((state: ProjectState) => ({
        projects: state.projects.map((p: Project) => (p.id === project.id ? project : p)),
        selectedProject: state.selectedProject?.id === project.id ? project : state.selectedProject,
      }));
    });

    socketClient.on('project:deleted', (data: { id: string }) => {
      set((state: ProjectState) => ({
        projects: state.projects.filter((p: Project) => p.id !== data.id),
        selectedProject: state.selectedProject?.id === data.id ? null : state.selectedProject,
      }));
    });
  },
}));
