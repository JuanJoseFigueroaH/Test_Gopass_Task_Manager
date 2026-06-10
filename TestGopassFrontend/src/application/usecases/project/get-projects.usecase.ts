import { Project } from '@/domain/entities/project.entity';
import { ProjectRepositoryPort } from '@/domain/ports/project.repository.port';
import { Result, DomainError } from '@/domain/types/result';
import { PaginatedResult, PaginationOptions } from '@/domain/types/pagination';

export class GetProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(options?: PaginationOptions): Promise<Result<PaginatedResult<Project>, DomainError>> {
    return Result.fromAsync(async () => {
      return this.projectRepository.getAll(options);
    });
  }
}
