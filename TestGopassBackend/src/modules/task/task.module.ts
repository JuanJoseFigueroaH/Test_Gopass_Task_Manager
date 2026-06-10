import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TaskOrmEntity } from './infrastructure/persistence/task.orm-entity';
import { TaskController } from './infrastructure/controllers/task.controller';
import { TaskRepositoryAdapter } from './infrastructure/adapters/task.repository.adapter';
import { TASK_REPOSITORY } from './domain/ports/task.repository.port';
import { CreateTaskHandler } from './application/handlers/create-task.handler';
import { UpdateTaskHandler } from './application/handlers/update-task.handler';
import { DeleteTaskHandler } from './application/handlers/delete-task.handler';
import { GetAllTasksHandler } from './application/handlers/get-all-tasks.handler';
import { GetTaskByIdHandler } from './application/handlers/get-task-by-id.handler';
import { GetTasksByProjectHandler } from './application/handlers/get-tasks-by-project.handler';
import { TaskCreatedEventHandler } from './application/event-handlers/task-created.event-handler';
import { TaskUpdatedEventHandler } from './application/event-handlers/task-updated.event-handler';
import { TaskDeletedEventHandler } from './application/event-handlers/task-deleted.event-handler';
import { WebSocketModule } from '../../shared/websocket/websocket.module';

const CommandHandlers = [CreateTaskHandler, UpdateTaskHandler, DeleteTaskHandler];
const QueryHandlers = [GetAllTasksHandler, GetTaskByIdHandler, GetTasksByProjectHandler];
const EventHandlers = [TaskCreatedEventHandler, TaskUpdatedEventHandler, TaskDeletedEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity]), CqrsModule, WebSocketModule],
  controllers: [TaskController],
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepositoryAdapter,
    },
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [TASK_REPOSITORY],
})
export class TaskModule {}
