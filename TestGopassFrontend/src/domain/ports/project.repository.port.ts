import { Project } from '../entities/project.entity';
import { PaginatedResult, PaginationOptions } from '../types/pagination';

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface ProjectReadRepositoryPort {
  getAll(options?: PaginationOptions): Promise<PaginatedResult<Project>>;
  getById(id: string): Promise<Project>;
}

export interface ProjectWriteRepositoryPort {
  create(data: CreateProjectDto): Promise<Project>;
  update(id: string, data: UpdateProjectDto): Promise<Project>;
  delete(id: string): Promise<boolean>;
}

export interface ProjectRepositoryPort extends ProjectReadRepositoryPort, ProjectWriteRepositoryPort {}
