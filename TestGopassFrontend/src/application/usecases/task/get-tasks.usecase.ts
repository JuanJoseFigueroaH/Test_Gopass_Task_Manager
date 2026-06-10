import { Task } from '@/domain/entities/project.entity';
import { TaskRepositoryPort } from '@/domain/ports/task.repository.port';
import { Result, DomainError } from '@/domain/types/result';
import { PaginatedResult, PaginationOptions } from '@/domain/types/pagination';

export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(options?: PaginationOptions): Promise<Result<PaginatedResult<Task>, DomainError>> {
    return Result.fromAsync(async () => {
      return this.taskRepository.getAll(options);
    });
  }
}
