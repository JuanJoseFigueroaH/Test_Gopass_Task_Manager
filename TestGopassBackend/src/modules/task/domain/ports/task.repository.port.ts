import { Task } from '../models/task.model';
import { PaginatedResult, PaginationOptions } from '../../../../shared/domain/pagination';

export interface TaskReadRepositoryPort {
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Task>>;
  findById(id: string): Promise<Task | null>;
  findByProjectId(projectId: string, options?: PaginationOptions): Promise<PaginatedResult<Task>>;
}

export interface TaskWriteRepositoryPort {
  create(task: Partial<Task>): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}

export interface TaskRepositoryPort extends TaskReadRepositoryPort, TaskWriteRepositoryPort {}

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
