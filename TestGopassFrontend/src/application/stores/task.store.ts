import { create } from 'zustand';
import { Task } from '@/domain/entities/project.entity';
import { CreateTaskDto, UpdateTaskDto } from '@/domain/ports/task.repository.port';
import { socketClient } from '@/infrastructure/websocket/socket.client';
import {
  getGetTasksUseCase,
  getGetTasksByProjectUseCase,
  getCreateTaskUseCase,
  getUpdateTaskUseCase,
  getDeleteTaskUseCase,
} from '@/core/di/container';
import { Result } from '@/domain/types/result';
import { PaginatedResult } from '@/domain/types/pagination';

interface OperationResult {
  success: boolean;
  message?: string;
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  currentProjectId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTasksByProject: (projectId: string) => Promise<void>;
  createTask: (data: CreateTaskDto) => Promise<OperationResult>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<OperationResult>;
  deleteTask: (id: string) => Promise<OperationResult>;
  setSelectedTask: (task: Task | null) => void;
  initWebSocket: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  currentProjectId: null,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    const result = await getGetTasksUseCase().execute();
    if (Result.isOk(result)) {
      set({ tasks: result.data.data, isLoading: false });
    } else {
      set({ error: result.error.message, isLoading: false });
    }
  },

  fetchTasksByProject: async (projectId: string) => {
    set({ isLoading: true, error: null, currentProjectId: projectId });
    const result = await getGetTasksByProjectUseCase().execute(projectId);
    if (Result.isOk(result)) {
      set({ tasks: result.data.data, isLoading: false });
    } else {
      set({ error: result.error.message, isLoading: false });
    }
  },

  createTask: async (data: CreateTaskDto): Promise<OperationResult> => {
    set({ isLoading: true, error: null });
    const result = await getCreateTaskUseCase().execute(data);
    if (Result.isOk(result)) {
      set((state: TaskState) => ({
        tasks: [result.data, ...state.tasks],
        isLoading: false,
      }));
      return { success: true, message: 'Tarea creada exitosamente' };
    } else {
      set({ error: result.error.message, isLoading: false });
      return { success: false, message: result.error.message };
    }
  },

  updateTask: async (id: string, data: UpdateTaskDto): Promise<OperationResult> => {
    set({ isLoading: true, error: null });
    const result = await getUpdateTaskUseCase().execute(id, data);
    if (Result.isOk(result)) {
      const updatedTask = result.data;
      set((state: TaskState) => ({
        tasks: state.tasks.map((t: Task) => (t.id === id ? updatedTask : t)),
        selectedTask: state.selectedTask?.id === id ? updatedTask : state.selectedTask,
        isLoading: false,
      }));
      return { success: true, message: 'Tarea actualizada exitosamente' };
    } else {
      set({ error: result.error.message, isLoading: false });
      return { success: false, message: result.error.message };
    }
  },

  deleteTask: async (id: string): Promise<OperationResult> => {
    set({ isLoading: true, error: null });
    const result = await getDeleteTaskUseCase().execute(id);
    if (Result.isOk(result)) {
      set((state: TaskState) => ({
        tasks: state.tasks.filter((t: Task) => t.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
        isLoading: false,
      }));
      return { success: true, message: 'Tarea eliminada exitosamente' };
    } else {
      set({ error: result.error.message, isLoading: false });
      return { success: false, message: result.error.message };
    }
  },

  setSelectedTask: (task: Task | null) => {
    set({ selectedTask: task });
  },

  initWebSocket: () => {
    socketClient.on('task:created', (task: Task) => {
      const currentProjectId = get().currentProjectId;
      if (task.projectId === currentProjectId) {
        set((state: TaskState) => ({
          tasks: [task, ...state.tasks.filter((t: Task) => t.id !== task.id)],
        }));
      }
    });

    socketClient.on('task:updated', (task: Task) => {
      set((state: TaskState) => ({
        tasks: state.tasks.map((t: Task) => (t.id === task.id ? task : t)),
        selectedTask: state.selectedTask?.id === task.id ? task : state.selectedTask,
      }));
    });

    socketClient.on('task:deleted', (data: { id: string; projectId: string }) => {
      set((state: TaskState) => ({
        tasks: state.tasks.filter((t: Task) => t.id !== data.id),
        selectedTask: state.selectedTask?.id === data.id ? null : state.selectedTask,
      }));
    });
  },
}));
