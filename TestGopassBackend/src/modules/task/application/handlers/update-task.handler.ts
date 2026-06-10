import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateTaskCommand } from '../commands/update-task.command';
import { TaskRepositoryPort, TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { Task } from '../../domain/models/task.model';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { TaskUpdatedEvent } from '../../domain/events/task-updated.event';
import { Result } from '../../../../shared/domain/result';
import { TaskNotFoundException } from '../../domain/exceptions/task.exceptions';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<Result<Task, DomainException>> {
    this.logger.log(`Updating task: ${command.id}`, 'UpdateTaskHandler');

    const existingTask = await this.taskRepository.findById(command.id);
    if (!existingTask) {
      return Result.fail(new TaskNotFoundException(command.id));
    }

    const task = await this.taskRepository.update(command.id, {
      title: command.title,
      description: command.description,
      status: command.status,
      priority: command.priority,
      dueDate: command.dueDate,
    });
    this.logger.log(`Task updated: ${command.id}`, 'UpdateTaskHandler');
    this.eventBus.publish(new TaskUpdatedEvent(task!));
    return Result.ok(task!);
  }
}
