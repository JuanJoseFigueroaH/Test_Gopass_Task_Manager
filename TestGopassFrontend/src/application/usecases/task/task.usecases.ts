import { taskRepository } from '@/infrastructure/adapters/task.repository.adapter';
import { GetTasksUseCase } from './get-tasks.usecase';
import { GetTasksByProjectUseCase } from './get-tasks-by-project.usecase';
import { CreateTaskUseCase } from './create-task.usecase';
import { UpdateTaskUseCase } from './update-task.usecase';
import { DeleteTaskUseCase } from './delete-task.usecase';

export const getTasksUseCase = new GetTasksUseCase(taskRepository);
export const getTasksByProjectUseCase = new GetTasksByProjectUseCase(taskRepository);
export const createTaskUseCase = new CreateTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
export const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
