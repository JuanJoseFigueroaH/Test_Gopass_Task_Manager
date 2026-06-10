import { TaskStatus, TaskPriority } from '../../domain/entities/task.entity';

export class UpdateTaskCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly status?: TaskStatus,
    public readonly priority?: TaskPriority,
    public readonly dueDate?: Date,
  ) {}
}
