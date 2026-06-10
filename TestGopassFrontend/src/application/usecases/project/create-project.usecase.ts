import { Project } from '@/domain/entities/project.entity';
import { ProjectRepositoryPort, CreateProjectDto } from '@/domain/ports/project.repository.port';
import { Result, ValidationError, DomainError } from '@/domain/types/result';

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(data: CreateProjectDto): Promise<Result<Project, DomainError>> {
    const validationResult = this.validate(data);
    if (Result.isFail(validationResult)) {
      return validationResult;
    }

    return Result.fromAsync(async () => {
      return this.projectRepository.create(data);
    });
  }

  private validate(data: CreateProjectDto): Result<void, ValidationError> {
    if (!data.name || data.name.trim().length === 0) {
      return Result.fail(new ValidationError('name', 'Project name is required'));
    }

    if (data.name.trim().length < 2) {
      return Result.fail(new ValidationError('name', 'Project name must be at least 2 characters long'));
    }

    if (data.name.trim().length > 255) {
      return Result.fail(new ValidationError('name', 'Project name cannot exceed 255 characters'));
    }

    return Result.ok(undefined);
  }
}
