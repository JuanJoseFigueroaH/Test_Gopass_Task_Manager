import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskOrmEntity } from '../persistence/task.orm-entity';
import { 
  TaskRepositoryPort,
  TaskReadRepositoryPort,
  TaskWriteRepositoryPort,
} from '../../domain/ports/task.repository.port';
import { Task } from '../../domain/models/task.model';
import { TaskMapper } from '../persistence/task.mapper';
import { 
  PaginatedResult, 
  PaginationOptions, 
  createPaginatedResult, 
  normalizePaginationOptions 
} from '../../../../shared/domain/pagination';

@Injectable()
export class TaskRepositoryAdapter implements TaskReadRepositoryPort, TaskWriteRepositoryPort {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly taskRepository: Repository<TaskOrmEntity>,
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    const ormEntity = this.taskRepository.create({
      title: task.title,
      description: task.description ?? undefined,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? undefined,
    });
    const saved = await this.taskRepository.save(ormEntity);
    return TaskMapper.toDomain(saved);
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Task>> {
    const { page, limit } = normalizePaginationOptions(options);
    const skip = (page - 1) * limit;

    const [entities, total] = await this.taskRepository.findAndCount({
      relations: ['project'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const data = TaskMapper.toDomainList(entities);
    return createPaginatedResult(data, total, page, limit);
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.taskRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    return entity ? TaskMapper.toDomain(entity) : null;
  }

  async findByProjectId(projectId: string, options?: PaginationOptions): Promise<PaginatedResult<Task>> {
    const { page, limit } = normalizePaginationOptions(options);
    const skip = (page - 1) * limit;

    const [entities, total] = await this.taskRepository.findAndCount({
      where: { projectId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const data = TaskMapper.toDomainList(entities);
    return createPaginatedResult(data, total, page, limit);
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    await this.taskRepository.update(id, {
      title: task.title,
      description: task.description ?? undefined,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? undefined,
    });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    return result.affected !== 0;
  }
}
