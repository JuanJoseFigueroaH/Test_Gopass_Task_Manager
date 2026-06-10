import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTasksByProjectQuery } from '../queries/get-tasks-by-project.query';
import { TaskReadRepositoryPort, TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { Task } from '../../domain/models/task.model';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { PaginatedResult } from '../../../../shared/domain/pagination';

@QueryHandler(GetTasksByProjectQuery)
export class GetTasksByProjectHandler implements IQueryHandler<GetTasksByProjectQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskReadRepositoryPort,
    private readonly logger: LoggerService,
  ) {}

  async execute(query: GetTasksByProjectQuery): Promise<PaginatedResult<Task>> {
    this.logger.log(`Fetching tasks for project: ${query.projectId}`, 'GetTasksByProjectHandler');
    return this.taskRepository.findByProjectId(query.projectId, query.options);
  }
}
