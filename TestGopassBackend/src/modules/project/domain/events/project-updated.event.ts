import { ProjectEntity } from '../entities/project.entity';

export class ProjectUpdatedEvent {
  constructor(public readonly project: ProjectEntity) {}
}
