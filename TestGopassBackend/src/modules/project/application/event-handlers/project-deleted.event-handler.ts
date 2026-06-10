import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectDeletedEvent } from '../../domain/events/project-deleted.event';
import { EventsGateway } from '../../../../shared/websocket/events.gateway';

@EventsHandler(ProjectDeletedEvent)
export class ProjectDeletedEventHandler implements IEventHandler<ProjectDeletedEvent> {
  constructor(private readonly eventsGateway: EventsGateway) {}

  handle(event: ProjectDeletedEvent): void {
    this.eventsGateway.emitProjectDeleted(event.projectId);
  }
}
