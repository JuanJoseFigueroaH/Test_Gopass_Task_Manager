import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProjectCommand } from '../commands/create-project.command';
import { ProjectWriteRepositoryPort, PROJECT_REPOSITORY } from '../../domain/ports/project.repository.port';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { ProjectCreatedEvent } from '../../domain/events/project-created.event';
import { Result } from '../../../../shared/domain/result';
import { ProjectValidationException } from '../../domain/exceptions/project.exceptions';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectWriteRepositoryPort,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProjectCommand): Promise<Result<ProjectEntity, DomainException>> {
    this.logger.log(`Creating project: ${command.name}`, 'CreateProjectHandler');

    if (!command.name || command.name.trim().length === 0) {
      return Result.fail(new ProjectValidationException('name', 'Name is required'));
    }

    const project = await this.projectRepository.create({
      name: command.name,
      description: command.description,
      userId: command.userId,
    });
    this.logger.log(`Project created with id: ${project.id}`, 'CreateProjectHandler');
    this.eventBus.publish(new ProjectCreatedEvent(project));
    return Result.ok(project);
  }
}
