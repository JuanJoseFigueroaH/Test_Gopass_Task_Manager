import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { UpdateTaskHandler } from './update-task.handler';
import { TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { UpdateTaskCommand } from '../commands/update-task.command';
import { TaskStatus, TaskPriority } from '../../domain/models/task.model';
import { Result } from '../../../../shared/domain/result';

describe('UpdateTaskHandler', () => {
  let handler: UpdateTaskHandler;
  let mockTaskRepository: any;
  let mockLogger: any;
  let mockEventBus: any;

  const mockTask = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Original Task',
    description: 'Original Description',
    projectId: '123e4567-e89b-12d3-a456-426614174000',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockTaskRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    mockEventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskHandler,
        { provide: TASK_REPOSITORY, useValue: mockTaskRepository },
        { provide: LoggerService, useValue: mockLogger },
        { provide: EventBus, useValue: mockEventBus },
      ],
    }).compile();

    handler = module.get<UpdateTaskHandler>(UpdateTaskHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should update a task successfully', async () => {
    const command = new UpdateTaskCommand(
      mockTask.id,
      'Updated Task',
      'Updated Description',
      TaskStatus.IN_PROGRESS,
      TaskPriority.HIGH,
    );

    const updatedTask = {
      ...mockTask,
      title: 'Updated Task',
      description: 'Updated Description',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockTaskRepository.update.mockResolvedValue(updatedTask);

    const result = await handler.execute(command);

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.data.title).toBe('Updated Task');
      expect(result.data.status).toBe(TaskStatus.IN_PROGRESS);
    }
    expect(mockTaskRepository.findById).toHaveBeenCalledWith(mockTask.id);
    expect(mockTaskRepository.update).toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenCalled();
  });

  it('should return fail Result when task does not exist', async () => {
    const command = new UpdateTaskCommand('non-existent-id', 'Updated Task');
    mockTaskRepository.findById.mockResolvedValue(null);

    const result = await handler.execute(command);

    expect(Result.isFail(result)).toBe(true);
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it('should update only title when only title is provided', async () => {
    const command = new UpdateTaskCommand(mockTask.id, 'Only Title Updated');

    const updatedTask = { ...mockTask, title: 'Only Title Updated' };
    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockTaskRepository.update.mockResolvedValue(updatedTask);

    const result = await handler.execute(command);

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.data.title).toBe('Only Title Updated');
      expect(result.data.description).toBe(mockTask.description);
      expect(result.data.status).toBe(mockTask.status);
    }
  });

  it('should update status to COMPLETED', async () => {
    const command = new UpdateTaskCommand(
      mockTask.id,
      undefined,
      undefined,
      TaskStatus.COMPLETED,
    );

    const updatedTask = { ...mockTask, status: TaskStatus.COMPLETED };
    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockTaskRepository.update.mockResolvedValue(updatedTask);

    const result = await handler.execute(command);

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.data.status).toBe(TaskStatus.COMPLETED);
    }
  });

  it('should update priority to URGENT', async () => {
    const command = new UpdateTaskCommand(
      mockTask.id,
      undefined,
      undefined,
      undefined,
      TaskPriority.URGENT,
    );

    const updatedTask = { ...mockTask, priority: TaskPriority.URGENT };
    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockTaskRepository.update.mockResolvedValue(updatedTask);

    const result = await handler.execute(command);

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.data.priority).toBe(TaskPriority.URGENT);
    }
  });
});
