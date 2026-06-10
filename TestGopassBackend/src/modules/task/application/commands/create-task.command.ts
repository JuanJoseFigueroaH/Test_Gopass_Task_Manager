import { TaskStatus, TaskPriority } from '../../domain/entities/task.entity';

export class CreateTaskCommand {
  constructor(
    public readonly title: string,
    public readonly projectId: string,
    public readonly description?: string,
    public readonly status?: TaskStatus,
    public readonly priority?: TaskPriority,
    public readonly dueDate?: Date,
  ) {}
}
