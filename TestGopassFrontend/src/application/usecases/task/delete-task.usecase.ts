import { TaskRepositoryPort } from '@/domain/ports/task.repository.port';
import { Result, ValidationError, DomainError } from '@/domain/types/result';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(id: string): Promise<Result<boolean, DomainError>> {
    if (!id) {
      return Result.fail(new ValidationError('id', 'Task ID is required'));
    }

    return Result.fromAsync(async () => {
      return this.taskRepository.delete(id);
    });
  }
}
