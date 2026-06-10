import { Task } from '@/domain/entities/project.entity';
import { TaskRepositoryPort, UpdateTaskDto } from '@/domain/ports/task.repository.port';
import { Result, ValidationError, DomainError } from '@/domain/types/result';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(id: string, data: UpdateTaskDto): Promise<Result<Task, DomainError>> {
    const validationResult = this.validate(id, data);
    if (Result.isFail(validationResult)) {
      return validationResult;
    }

    return Result.fromAsync(async () => {
      return this.taskRepository.update(id, data);
    });
  }

  private validate(id: string, data: UpdateTaskDto): Result<void, ValidationError> {
    if (!id) {
      return Result.fail(new ValidationError('id', 'Task ID is required'));
    }

    if (data.title !== undefined && data.title.trim().length < 3) {
      return Result.fail(new ValidationError('title', 'Task title must be at least 3 characters long'));
    }

    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        return Result.fail(new ValidationError('dueDate', 'Due date cannot be in the past'));
      }
    }

    return Result.ok(undefined);
  }
}
