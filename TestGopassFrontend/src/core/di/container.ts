import { TaskRepositoryPort } from '@/domain/ports/task.repository.port';
import { ProjectRepositoryPort } from '@/domain/ports/project.repository.port';
import { TaskRepositoryAdapter } from '@/infrastructure/adapters/task.repository.adapter';
import { ProjectRepositoryAdapter } from '@/infrastructure/adapters/project.repository.adapter';

import { GetTasksUseCase } from '@/application/usecases/task/get-tasks.usecase';
import { GetTasksByProjectUseCase } from '@/application/usecases/task/get-tasks-by-project.usecase';
import { CreateTaskUseCase } from '@/application/usecases/task/create-task.usecase';
import { UpdateTaskUseCase } from '@/application/usecases/task/update-task.usecase';
import { DeleteTaskUseCase } from '@/application/usecases/task/delete-task.usecase';

import { GetProjectsUseCase } from '@/application/usecases/project/get-projects.usecase';
import { GetProjectByIdUseCase } from '@/application/usecases/project/get-project-by-id.usecase';
import { CreateProjectUseCase } from '@/application/usecases/project/create-project.usecase';
import { UpdateProjectUseCase } from '@/application/usecases/project/update-project.usecase';
import { DeleteProjectUseCase } from '@/application/usecases/project/delete-project.usecase';

class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, unknown> = new Map();

  private constructor() {
    this.registerRepositories();
    this.registerUseCases();
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private registerRepositories(): void {
    this.services.set('TaskRepository', new TaskRepositoryAdapter());
    this.services.set('ProjectRepository', new ProjectRepositoryAdapter());
  }

  private registerUseCases(): void {
    const taskRepository = this.get<TaskRepositoryPort>('TaskRepository');
    const projectRepository = this.get<ProjectRepositoryPort>('ProjectRepository');

    this.services.set('GetTasksUseCase', new GetTasksUseCase(taskRepository));
    this.services.set('GetTasksByProjectUseCase', new GetTasksByProjectUseCase(taskRepository));
    this.services.set('CreateTaskUseCase', new CreateTaskUseCase(taskRepository));
    this.services.set('UpdateTaskUseCase', new UpdateTaskUseCase(taskRepository));
    this.services.set('DeleteTaskUseCase', new DeleteTaskUseCase(taskRepository));

    this.services.set('GetProjectsUseCase', new GetProjectsUseCase(projectRepository));
    this.services.set('GetProjectByIdUseCase', new GetProjectByIdUseCase(projectRepository));
    this.services.set('CreateProjectUseCase', new CreateProjectUseCase(projectRepository));
    this.services.set('UpdateProjectUseCase', new UpdateProjectUseCase(projectRepository));
    this.services.set('DeleteProjectUseCase', new DeleteProjectUseCase(projectRepository));
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found in DI container`);
    }
    return service as T;
  }

  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  reset(): void {
    this.services.clear();
    this.registerRepositories();
    this.registerUseCases();
  }
}

export const container = DIContainer.getInstance();

export const getGetTasksUseCase = () => container.get<GetTasksUseCase>('GetTasksUseCase');
export const getGetTasksByProjectUseCase = () => container.get<GetTasksByProjectUseCase>('GetTasksByProjectUseCase');
export const getCreateTaskUseCase = () => container.get<CreateTaskUseCase>('CreateTaskUseCase');
export const getUpdateTaskUseCase = () => container.get<UpdateTaskUseCase>('UpdateTaskUseCase');
export const getDeleteTaskUseCase = () => container.get<DeleteTaskUseCase>('DeleteTaskUseCase');

export const getGetProjectsUseCase = () => container.get<GetProjectsUseCase>('GetProjectsUseCase');
export const getGetProjectByIdUseCase = () => container.get<GetProjectByIdUseCase>('GetProjectByIdUseCase');
export const getCreateProjectUseCase = () => container.get<CreateProjectUseCase>('CreateProjectUseCase');
export const getUpdateProjectUseCase = () => container.get<UpdateProjectUseCase>('UpdateProjectUseCase');
export const getDeleteProjectUseCase = () => container.get<DeleteProjectUseCase>('DeleteProjectUseCase');
