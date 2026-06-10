import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllProjectsQuery } from '../queries/get-all-projects.query';
import { ProjectReadRepositoryPort, PROJECT_REPOSITORY } from '../../domain/ports/project.repository.port';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { PaginatedResult } from '../../../../shared/domain/pagination';

@QueryHandler(GetAllProjectsQuery)
export class GetAllProjectsHandler implements IQueryHandler<GetAllProjectsQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectReadRepositoryPort,
    private readonly logger: LoggerService,
  ) {}

  async execute(query: GetAllProjectsQuery): Promise<PaginatedResult<ProjectEntity>> {
    this.logger.log(`Fetching projects for user: ${query.userId}`, 'GetAllProjectsHandler');
    return this.projectRepository.findAllByUserId(query.userId!, query.options);
  }
}
