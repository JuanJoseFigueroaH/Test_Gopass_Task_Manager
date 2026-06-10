import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProjectCommand } from '../commands/update-project.command';
import { ProjectRepositoryPort, PROJECT_REPOSITORY } from '../../domain/ports/project.repository.port';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { ProjectUpdatedEvent } from '../../domain/events/project-updated.event';
import { Result } from '../../../../shared/domain/result';
import { ProjectNotFoundException } from '../../domain/exceptions/project.exceptions';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<Result<ProjectEntity, DomainException>> {
    this.logger.log(`Updating project: ${command.id}`, 'UpdateProjectHandler');
    
    const existingProject = await this.projectRepository.findById(command.id);
    if (!existingProject) {
      return Result.fail(new ProjectNotFoundException(command.id));
    }

    const updateData: Partial<ProjectEntity> = {};
    if (command.name !== undefined) updateData.name = command.name;
    if (command.description !== undefined) updateData.description = command.description;
    if (command.isActive !== undefined) updateData.isActive = command.isActive;

    const project = await this.projectRepository.update(command.id, updateData);
    this.logger.log(`Project updated: ${command.id}`, 'UpdateProjectHandler');
    this.eventBus.publish(new ProjectUpdatedEvent(project!));
    return Result.ok(project!);
  }
}
