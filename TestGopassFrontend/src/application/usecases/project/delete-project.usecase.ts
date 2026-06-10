import { ProjectRepositoryPort } from '@/domain/ports/project.repository.port';
import { Result, ValidationError, DomainError } from '@/domain/types/result';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(id: string): Promise<Result<boolean, DomainError>> {
    if (!id) {
      return Result.fail(new ValidationError('id', 'Project ID is required'));
    }

    return Result.fromAsync(async () => {
      return this.projectRepository.delete(id);
    });
  }
}
