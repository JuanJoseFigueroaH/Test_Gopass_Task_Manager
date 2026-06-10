import { Task, TaskStatus, TaskPriority } from '../entities/project.entity';
import { PaginatedResult, PaginationOptions } from '../types/pagination';

export interface CreateTaskDto {
  title: string;
  projectId: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface TaskReadRepositoryPort {
  getAll(options?: PaginationOptions): Promise<PaginatedResult<Task>>;
  getById(id: string): Promise<Task>;
  getByProjectId(projectId: string, options?: PaginationOptions): Promise<PaginatedResult<Task>>;
}

export interface TaskWriteRepositoryPort {
  create(data: CreateTaskDto): Promise<Task>;
  update(id: string, data: UpdateTaskDto): Promise<Task>;
  delete(id: string): Promise<boolean>;
}

export interface TaskRepositoryPort extends TaskReadRepositoryPort, TaskWriteRepositoryPort {}
