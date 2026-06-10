import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskHandler } from './create-task.handler';
import { TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { CreateTaskCommand } from '../commands/create-task.command';
import { TaskStatus, TaskPriority } from '../../domain/entities/task.entity';

describe('CreateTaskHandler', () => {
  let handler: CreateTaskHandler;
  let mockTaskRepository: any;
  let mockLogger: any;

  beforeEach(async () => {
    mockTaskRepository = {
      create: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskHandler,
        { provide: TASK_REPOSITORY, useValue: mockTaskRepository },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    handler = module.get<CreateTaskHandler>(CreateTaskHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create a task successfully', async () => {
    const command = new CreateTaskCommand(
      'Test Task',
      '123e4567-e89b-12d3-a456-426614174000',
      'Test Description',
      TaskStatus.PENDING,
      TaskPriority.HIGH,
      new Date('2024-12-31'),
    );

    const expectedTask = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Test Task',
      description: 'Test Description',
      projectId: '123e4567-e89b-12d3-a456-426614174000',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2024-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTaskRepository.create.mockResolvedValue(expectedTask);

    const result = await handler.execute(command);

    expect(result).toEqual(expectedTask);
    expect(mockTaskRepository.create).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description',
      projectId: '123e4567-e89b-12d3-a456-426614174000',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2024-12-31'),
    });
    expect(mockLogger.log).toHaveBeenCalledTimes(2);
  });

  it('should create a task with minimal data', async () => {
    const command = new CreateTaskCommand(
      'Test Task',
      '123e4567-e89b-12d3-a456-426614174000',
    );

    const expectedTask = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Test Task',
      projectId: '123e4567-e89b-12d3-a456-426614174000',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTaskRepository.create.mockResolvedValue(expectedTask);

    const result = await handler.execute(command);

    expect(result).toEqual(expectedTask);
  });
});
