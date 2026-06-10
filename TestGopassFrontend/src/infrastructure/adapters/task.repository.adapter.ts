import { Task } from '@/domain/entities/project.entity';
import { TaskRepositoryPort, CreateTaskDto, UpdateTaskDto } from '@/domain/ports/task.repository.port';
import { PaginatedResult, PaginationOptions } from '@/domain/types/pagination';
import { apiClient } from '../api/api.client';

export class TaskRepositoryAdapter implements TaskRepositoryPort {
  async getAll(options?: PaginationOptions): Promise<PaginatedResult<Task>> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<PaginatedResult<Task>>(`/tasks${query}`);
  }

  async getById(id: string): Promise<Task> {
    return apiClient.get<Task>(`/tasks/${id}`);
  }

  async getByProjectId(projectId: string, options?: PaginationOptions): Promise<PaginatedResult<Task>> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<PaginatedResult<Task>>(`/tasks/project/${projectId}${query}`);
  }

  async create(data: CreateTaskDto): Promise<Task> {
    return apiClient.post<Task>('/tasks', data);
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    return apiClient.put<Task>(`/tasks/${id}`, data);
  }

  async delete(id: string): Promise<boolean> {
    return apiClient.delete<boolean>(`/tasks/${id}`);
  }
}

