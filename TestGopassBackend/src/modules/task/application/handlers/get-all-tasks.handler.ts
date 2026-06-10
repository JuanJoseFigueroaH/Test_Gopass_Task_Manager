import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllTasksQuery } from '../queries/get-all-tasks.query';
import { TaskReadRepositoryPort, TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { Task } from '../../domain/models/task.model';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { PaginatedResult } from '../../../../shared/domain/pagination';

@QueryHandler(GetAllTasksQuery)
export class GetAllTasksHandler implements IQueryHandler<GetAllTasksQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskReadRepositoryPort,
    private readonly logger: LoggerService,
  ) {}

  async execute(query: GetAllTasksQuery): Promise<PaginatedResult<Task>> {
    this.logger.log('Fetching all tasks', 'GetAllTasksHandler');
    return this.taskRepository.findAll(query.options);
  }
}
