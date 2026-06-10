import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectEntity } from './domain/entities/project.entity';
import { ProjectController } from './infrastructure/controllers/project.controller';
import { ProjectRepositoryAdapter } from './infrastructure/adapters/project.repository.adapter';
import { PROJECT_REPOSITORY } from './domain/ports/project.repository.port';
import { CreateProjectHandler } from './application/handlers/create-project.handler';
import { UpdateProjectHandler } from './application/handlers/update-project.handler';
import { DeleteProjectHandler } from './application/handlers/delete-project.handler';
import { GetAllProjectsHandler } from './application/handlers/get-all-projects.handler';
import { GetProjectByIdHandler } from './application/handlers/get-project-by-id.handler';
import { ProjectCreatedEventHandler } from './application/event-handlers/project-created.event-handler';
import { ProjectUpdatedEventHandler } from './application/event-handlers/project-updated.event-handler';
import { ProjectDeletedEventHandler } from './application/event-handlers/project-deleted.event-handler';
import { WebSocketModule } from '../../shared/websocket/websocket.module';

const CommandHandlers = [CreateProjectHandler, UpdateProjectHandler, DeleteProjectHandler];
const QueryHandlers = [GetAllProjectsHandler, GetProjectByIdHandler];
const EventHandlers = [ProjectCreatedEventHandler, ProjectUpdatedEventHandler, ProjectDeletedEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), CqrsModule, WebSocketModule],
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepositoryAdapter,
    },
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [PROJECT_REPOSITORY],
})
export class ProjectModule {}
