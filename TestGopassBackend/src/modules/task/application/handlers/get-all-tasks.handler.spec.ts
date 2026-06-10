import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTasksHandler } from './get-all-tasks.handler';
import { TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { GetAllTasksQuery } from '../queries/get-all-tasks.query';
import { TaskStatus, TaskPriority } from '../../domain/models/task.model';

describe('GetAllTasksHandler', () => {
  let handler: GetAllTasksHandler;
  let mockTaskRepository: any;
  let mockLogger: any;

  const mockTasks = [
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Task 1',
      description: 'Description 1',
      projectId: '123e4567-e89b-12d3-a456-426614174000',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      title: 'Task 2',
      description: 'Description 2',
      projectId: '123e4567-e89b-12d3-a456-426614174000',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.LOW,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockTaskRepository = {
      findAll: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllTasksHandler,
        { provide: TASK_REPOSITORY, useValue: mockTaskRepository },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    handler = module.get<GetAllTasksHandler>(GetAllTasksHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return all tasks', async () => {
    mockTaskRepository.findAll.mockResolvedValue(mockTasks);

    const result = await handler.execute(new GetAllTasksQuery());

    expect(result).toEqual(mockTasks);
    expect(result).toHaveLength(2);
    expect(mockTaskRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no tasks exist', async () => {
    mockTaskRepository.findAll.mockResolvedValue([]);

    const result = await handler.execute(new GetAllTasksQuery());

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should log the query execution', async () => {
    mockTaskRepository.findAll.mockResolvedValue(mockTasks);

    await handler.execute(new GetAllTasksQuery());

    expect(mockLogger.log).toHaveBeenCalledWith(
      'Fetching all tasks',
      'GetAllTasksHandler',
    );
  });
});
