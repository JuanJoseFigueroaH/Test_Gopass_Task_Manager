import { Task } from '@/domain/entities/project.entity';
import { TaskRepositoryPort, CreateTaskDto } from '@/domain/ports/task.repository.port';
import { Result, ValidationError, DomainError } from '@/domain/types/result';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(data: CreateTaskDto): Promise<Result<Task, DomainError>> {
    const validationResult = this.validate(data);
    if (Result.isFail(validationResult)) {
      return validationResult;
    }

    return Result.fromAsync(async () => {
      return this.taskRepository.create(data);
    });
  }

  private validate(data: CreateTaskDto): Result<void, ValidationError> {
    if (!data.title || data.title.trim().length === 0) {
      return Result.fail(new ValidationError('title', 'Task title is required'));
    }

    if (data.title.trim().length < 3) {
      return Result.fail(new ValidationError('title', 'Task title must be at least 3 characters long'));
    }

    if (!data.projectId) {
      return Result.fail(new ValidationError('projectId', 'Project ID is required'));
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
