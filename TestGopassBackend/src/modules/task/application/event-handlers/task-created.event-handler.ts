import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaskCreatedEvent } from '../../domain/events/task-created.event';
import { EventsGateway } from '../../../../shared/websocket/events.gateway';

@EventsHandler(TaskCreatedEvent)
export class TaskCreatedEventHandler implements IEventHandler<TaskCreatedEvent> {
  constructor(private readonly eventsGateway: EventsGateway) {}

  handle(event: TaskCreatedEvent): void {
    this.eventsGateway.emitTaskCreated(event.task);
  }
}
