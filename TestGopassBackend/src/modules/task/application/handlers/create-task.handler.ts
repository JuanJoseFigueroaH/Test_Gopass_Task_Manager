import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateTaskCommand } from '../commands/create-task.command';
import { TaskWriteRepositoryPort, TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { Task } from '../../domain/models/task.model';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { TaskCreatedEvent } from '../../domain/events/task-created.event';
import { Result } from '../../../../shared/domain/result';
import { TaskValidationException } from '../../domain/exceptions/task.exceptions';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskWriteRepositoryPort,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTaskCommand): Promise<Result<Task, DomainException>> {
    this.logger.log(`Creating task: ${command.title}`, 'CreateTaskHandler');

    if (!command.title || command.title.trim().length === 0) {
      return Result.fail(new TaskValidationException('title', 'Title is required'));
    }

    if (!command.projectId) {
      return Result.fail(new TaskValidationException('projectId', 'Project ID is required'));
    }

    const task = await this.taskRepository.create({
      title: command.title,
      description: command.description,
      projectId: command.projectId,
      status: command.status,
      priority: command.priority,
      dueDate: command.dueDate,
    });
    this.logger.log(`Task created with id: ${task.id}`, 'CreateTaskHandler');
    this.eventBus.publish(new TaskCreatedEvent(task));
    return Result.ok(task);
  }
}
