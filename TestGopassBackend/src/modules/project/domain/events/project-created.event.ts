import { ProjectEntity } from '../entities/project.entity';

export class ProjectCreatedEvent {
  constructor(public readonly project: ProjectEntity) {}
}
