import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaskDeletedEvent } from '../../domain/events/task-deleted.event';
import { EventsGateway } from '../../../../shared/websocket/events.gateway';

@EventsHandler(TaskDeletedEvent)
export class TaskDeletedEventHandler implements IEventHandler<TaskDeletedEvent> {
  constructor(private readonly eventsGateway: EventsGateway) {}

  handle(event: TaskDeletedEvent): void {
    this.eventsGateway.emitTaskDeleted(event.taskId, event.projectId);
  }
}
