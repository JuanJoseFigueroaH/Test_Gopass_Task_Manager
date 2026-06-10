import { Project } from '../../domain/models/project.model';
import { ProjectOrmEntity } from './project.orm-entity';

export class ProjectMapper {
  static toDomain(ormEntity: ProjectOrmEntity): Project {
    return Project.reconstitute({
      id: ormEntity.id,
      name: ormEntity.name,
      description: ormEntity.description,
      isActive: ormEntity.isActive,
      userId: ormEntity.userId,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toOrmEntity(domain: Project): Partial<ProjectOrmEntity> {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description ?? undefined,
      isActive: domain.isActive,
      userId: domain.userId,
    };
  }

  static toResponse(domain: Project) {
    return domain.toPlainObject();
  }

  static toDomainList(ormEntities: ProjectOrmEntity[]): Project[] {
    return ormEntities.map((entity) => this.toDomain(entity));
  }
}
