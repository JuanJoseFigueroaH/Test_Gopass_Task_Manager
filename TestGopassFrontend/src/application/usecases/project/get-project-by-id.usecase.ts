import { Project } from '@/domain/entities/project.entity';
import { ProjectReadRepositoryPort } from '@/domain/ports/project.repository.port';
import { Result, ValidationError, DomainError } from '@/domain/types/result';

export class GetProjectByIdUseCase {
  constructor(private readonly projectRepository: ProjectReadRepositoryPort) {}

  async execute(id: string): Promise<Result<Project, DomainError>> {
    if (!id) {
      return Result.fail(new ValidationError('id', 'Project ID is required'));
    }

    return Result.fromAsync(async () => {
      return this.projectRepository.getById(id);
    });
  }
}
