import { ProjectEntity } from '../entities/project.entity';
import { PaginatedResult, PaginationOptions } from '../../../../shared/domain/pagination';

export interface ProjectReadRepositoryPort {
  findAll(options?: PaginationOptions): Promise<PaginatedResult<ProjectEntity>>;
  findAllByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<ProjectEntity>>;
  findById(id: string): Promise<ProjectEntity | null>;
}

export interface ProjectWriteRepositoryPort {
  create(project: Partial<ProjectEntity>): Promise<ProjectEntity>;
  update(id: string, project: Partial<ProjectEntity>): Promise<ProjectEntity | null>;
  delete(id: string): Promise<boolean>;
}

export interface ProjectRepositoryPort extends ProjectReadRepositoryPort, ProjectWriteRepositoryPort {}

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');
