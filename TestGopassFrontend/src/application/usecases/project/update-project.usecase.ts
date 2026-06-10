import { Project } from '@/domain/entities/project.entity';
import { ProjectRepositoryPort, UpdateProjectDto } from '@/domain/ports/project.repository.port';
import { Result, ValidationError, DomainError } from '@/domain/types/result';

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(id: string, data: UpdateProjectDto): Promise<Result<Project, DomainError>> {
    const validationResult = this.validate(id, data);
    if (Result.isFail(validationResult)) {
      return validationResult;
    }

    return Result.fromAsync(async () => {
      return this.projectRepository.update(id, data);
    });
  }

  private validate(id: string, data: UpdateProjectDto): Result<void, ValidationError> {
    if (!id) {
      return Result.fail(new ValidationError('id', 'Project ID is required'));
    }

    if (data.name !== undefined) {
      if (data.name.trim().length < 2) {
        return Result.fail(new ValidationError('name', 'Project name must be at least 2 characters long'));
      }
      if (data.name.trim().length > 255) {
        return Result.fail(new ValidationError('name', 'Project name cannot exceed 255 characters'));
      }
    }

    return Result.ok(undefined);
  }
}
