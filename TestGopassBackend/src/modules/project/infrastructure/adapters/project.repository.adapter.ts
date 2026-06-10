import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { 
  ProjectRepositoryPort,
  ProjectReadRepositoryPort,
  ProjectWriteRepositoryPort,
} from '../../domain/ports/project.repository.port';
import { 
  PaginatedResult, 
  PaginationOptions, 
  createPaginatedResult, 
  normalizePaginationOptions 
} from '../../../../shared/domain/pagination';

@Injectable()
export class ProjectRepositoryAdapter implements ProjectReadRepositoryPort, ProjectWriteRepositoryPort {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async create(project: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const newProject = this.projectRepository.create(project);
    return this.projectRepository.save(newProject);
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<ProjectEntity>> {
    const { page, limit } = normalizePaginationOptions(options);
    const skip = (page - 1) * limit;

    const [entities, total] = await this.projectRepository.findAndCount({
      relations: ['tasks'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return createPaginatedResult(entities, total, page, limit);
  }

  async findAllByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<ProjectEntity>> {
    const { page, limit } = normalizePaginationOptions(options);
    const skip = (page - 1) * limit;

    const [entities, total] = await this.projectRepository.findAndCount({
      where: { userId },
      relations: ['tasks'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return createPaginatedResult(entities, total, page, limit);
  }

  async findById(id: string): Promise<ProjectEntity | null> {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
  }

  async update(id: string, project: Partial<ProjectEntity>): Promise<ProjectEntity | null> {
    await this.projectRepository.update(id, project);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.projectRepository.delete(id);
    return result.affected !== 0;
  }
}
