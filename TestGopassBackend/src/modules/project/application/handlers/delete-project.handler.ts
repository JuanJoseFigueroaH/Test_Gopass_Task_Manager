import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteProjectCommand } from '../commands/delete-project.command';
import { ProjectRepositoryPort, PROJECT_REPOSITORY } from '../../domain/ports/project.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { ProjectDeletedEvent } from '../../domain/events/project-deleted.event';
import { Result } from '../../../../shared/domain/result';
import { ProjectNotFoundException } from '../../domain/exceptions/project.exceptions';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteProjectCommand): Promise<Result<boolean, DomainException>> {
    this.logger.log(`Deleting project: ${command.id}`, 'DeleteProjectHandler');
    
    const existingProject = await this.projectRepository.findById(command.id);
    if (!existingProject) {
      return Result.fail(new ProjectNotFoundException(command.id));
    }

    const deleted = await this.projectRepository.delete(command.id);
    this.logger.log(`Project deleted: ${command.id}`, 'DeleteProjectHandler');
    this.eventBus.publish(new ProjectDeletedEvent(command.id));
    return Result.ok(deleted);
  }
}
