import { Task } from '@/domain/entities/project.entity';
import { TaskRepositoryPort } from '@/domain/ports/task.repository.port';
import { Result, ValidationError, DomainError } from '@/domain/types/result';
import { PaginatedResult, PaginationOptions } from '@/domain/types/pagination';

export class GetTasksByProjectUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(projectId: string, options?: PaginationOptions): Promise<Result<PaginatedResult<Task>, DomainError>> {
    if (!projectId) {
      return Result.fail(new ValidationError('projectId', 'Project ID is required'));
    }

    return Result.fromAsync(async () => {
      return this.taskRepository.getByProjectId(projectId, options);
    });
  }
}
