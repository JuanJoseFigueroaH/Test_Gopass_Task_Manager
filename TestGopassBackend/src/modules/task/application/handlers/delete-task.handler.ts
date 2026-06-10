import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteTaskCommand } from '../commands/delete-task.command';
import { TaskRepositoryPort, TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { TaskDeletedEvent } from '../../domain/events/task-deleted.event';
import { Result } from '../../../../shared/domain/result';
import { TaskNotFoundException } from '../../domain/exceptions/task.exceptions';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<Result<boolean, DomainException>> {
    this.logger.log(`Deleting task: ${command.id}`, 'DeleteTaskHandler');

    const existingTask = await this.taskRepository.findById(command.id);
    if (!existingTask) {
      return Result.fail(new TaskNotFoundException(command.id));
    }

    const projectId = existingTask.projectId;
    const deleted = await this.taskRepository.delete(command.id);
    this.logger.log(`Task deleted: ${command.id}`, 'DeleteTaskHandler');
    this.eventBus.publish(new TaskDeletedEvent(command.id, projectId));
    return Result.ok(deleted);
  }
}
