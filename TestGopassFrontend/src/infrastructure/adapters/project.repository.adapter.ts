import { Project } from '@/domain/entities/project.entity';
import { ProjectRepositoryPort, CreateProjectDto, UpdateProjectDto } from '@/domain/ports/project.repository.port';
import { PaginatedResult, PaginationOptions } from '@/domain/types/pagination';
import { apiClient } from '../api/api.client';

export class ProjectRepositoryAdapter implements ProjectRepositoryPort {
  async getAll(options?: PaginationOptions): Promise<PaginatedResult<Project>> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<PaginatedResult<Project>>(`/projects${query}`);
  }

  async getById(id: string): Promise<Project> {
    return apiClient.get<Project>(`/projects/${id}`);
  }

  async create(data: CreateProjectDto): Promise<Project> {
    return apiClient.post<Project>('/projects', data);
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    return apiClient.put<Project>(`/projects/${id}`, data);
  }

  async delete(id: string): Promise<boolean> {
    return apiClient.delete<boolean>(`/projects/${id}`);
  }
}

