import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaskUpdatedEvent } from '../../domain/events/task-updated.event';
import { EventsGateway } from '../../../../shared/websocket/events.gateway';

@EventsHandler(TaskUpdatedEvent)
export class TaskUpdatedEventHandler implements IEventHandler<TaskUpdatedEvent> {
  constructor(private readonly eventsGateway: EventsGateway) {}

  handle(event: TaskUpdatedEvent): void {
    this.eventsGateway.emitTaskUpdated(event.task);
  }
}
