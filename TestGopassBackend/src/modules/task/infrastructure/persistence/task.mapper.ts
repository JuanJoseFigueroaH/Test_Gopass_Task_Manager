import { Task, TaskStatus, TaskPriority } from '../../domain/models/task.model';
import { TaskOrmEntity } from './task.orm-entity';

export class TaskMapper {
  static toDomain(ormEntity: TaskOrmEntity): Task {
    return Task.reconstitute({
      id: ormEntity.id,
      title: ormEntity.title,
      description: ormEntity.description,
      status: ormEntity.status as TaskStatus,
      priority: ormEntity.priority as TaskPriority,
      dueDate: ormEntity.dueDate,
      projectId: ormEntity.projectId,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toOrmEntity(domain: Task): Partial<TaskOrmEntity> {
    return {
      id: domain.id,
      title: domain.title,
      description: domain.description ?? undefined,
      status: domain.status,
      priority: domain.priority,
      dueDate: domain.dueDate ?? undefined,
      projectId: domain.projectId,
    };
  }

  static toResponse(domain: Task) {
    return domain.toPlainObject();
  }

  static toDomainList(ormEntities: TaskOrmEntity[]): Task[] {
    return ormEntities.map((entity) => this.toDomain(entity));
  }
}
