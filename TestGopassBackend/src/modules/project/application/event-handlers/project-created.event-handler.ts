import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectCreatedEvent } from '../../domain/events/project-created.event';
import { EventsGateway } from '../../../../shared/websocket/events.gateway';

@EventsHandler(ProjectCreatedEvent)
export class ProjectCreatedEventHandler implements IEventHandler<ProjectCreatedEvent> {
  constructor(private readonly eventsGateway: EventsGateway) {}

  handle(event: ProjectCreatedEvent): void {
    this.eventsGateway.emitProjectCreated(event.project);
  }
}
