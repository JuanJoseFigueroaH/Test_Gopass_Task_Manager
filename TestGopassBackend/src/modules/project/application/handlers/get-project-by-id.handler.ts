import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectByIdQuery } from '../queries/get-project-by-id.query';
import { ProjectReadRepositoryPort, PROJECT_REPOSITORY } from '../../domain/ports/project.repository.port';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { Result } from '../../../../shared/domain/result';
import { ProjectNotFoundException } from '../../domain/exceptions/project.exceptions';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdHandler implements IQueryHandler<GetProjectByIdQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectReadRepositoryPort,
    private readonly logger: LoggerService,
  ) {}

  async execute(query: GetProjectByIdQuery): Promise<Result<ProjectEntity, DomainException>> {
    this.logger.log(`Fetching project by id: ${query.id}`, 'GetProjectByIdHandler');
    const project = await this.projectRepository.findById(query.id);
    if (!project) {
      return Result.fail(new ProjectNotFoundException(query.id));
    }
    return Result.ok(project);
  }
}
