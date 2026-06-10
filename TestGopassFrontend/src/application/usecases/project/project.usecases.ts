import { projectRepository } from '@/infrastructure/adapters/project.repository.adapter';
import { GetProjectsUseCase } from './get-projects.usecase';
import { CreateProjectUseCase } from './create-project.usecase';
import { UpdateProjectUseCase } from './update-project.usecase';
import { DeleteProjectUseCase } from './delete-project.usecase';

export const getProjectsUseCase = new GetProjectsUseCase(projectRepository);
export const createProjectUseCase = new CreateProjectUseCase(projectRepository);
export const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
export const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);
