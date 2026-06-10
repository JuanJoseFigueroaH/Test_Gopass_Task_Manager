import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectUpdatedEvent } from '../../domain/events/project-updated.event';
import { EventsGateway } from '../../../../shared/websocket/events.gateway';

@EventsHandler(ProjectUpdatedEvent)
export class ProjectUpdatedEventHandler implements IEventHandler<ProjectUpdatedEvent> {
  constructor(private readonly eventsGateway: EventsGateway) {}

  handle(event: ProjectUpdatedEvent): void {
    this.eventsGateway.emitProjectUpdated(event.project);
  }
}
