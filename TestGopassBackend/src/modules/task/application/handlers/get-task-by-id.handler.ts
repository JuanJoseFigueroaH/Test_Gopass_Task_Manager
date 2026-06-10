import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTaskByIdQuery } from '../queries/get-task-by-id.query';
import { TaskReadRepositoryPort, TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { Task } from '../../domain/models/task.model';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { Result } from '../../../../shared/domain/result';
import { TaskNotFoundException } from '../../domain/exceptions/task.exceptions';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskReadRepositoryPort,
    private readonly logger: LoggerService,
  ) {}

  async execute(query: GetTaskByIdQuery): Promise<Result<Task, DomainException>> {
    this.logger.log(`Fetching task by id: ${query.id}`, 'GetTaskByIdHandler');
    const task = await this.taskRepository.findById(query.id);
    if (!task) {
      return Result.fail(new TaskNotFoundException(query.id));
    }
    return Result.ok(task);
  }
}
