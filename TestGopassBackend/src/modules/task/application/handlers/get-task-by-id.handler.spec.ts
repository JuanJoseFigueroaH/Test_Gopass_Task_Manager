import { Test, TestingModule } from '@nestjs/testing';
import { GetTaskByIdHandler } from './get-task-by-id.handler';
import { TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { GetTaskByIdQuery } from '../queries/get-task-by-id.query';
import { TaskStatus, TaskPriority } from '../../domain/models/task.model';
import { NotFoundException } from '../../../../shared/domain/exceptions/domain.exception';

describe('GetTaskByIdHandler', () => {
  let handler: GetTaskByIdHandler;
  let mockTaskRepository: any;
  let mockLogger: any;

  const mockTask = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Test Task',
    description: 'Test Description',
    projectId: '123e4567-e89b-12d3-a456-426614174000',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockTaskRepository = {
      findById: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTaskByIdHandler,
        { provide: TASK_REPOSITORY, useValue: mockTaskRepository },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    handler = module.get<GetTaskByIdHandler>(GetTaskByIdHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return a task when found', async () => {
    const query = new GetTaskByIdQuery(mockTask.id);
    mockTaskRepository.findById.mockResolvedValue(mockTask);

    const result = await handler.execute(query);

    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.findById).toHaveBeenCalledWith(mockTask.id);
    expect(mockLogger.log).toHaveBeenCalled();
  });

  it('should throw NotFoundException when task not found', async () => {
    const query = new GetTaskByIdQuery('non-existent-id');
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
  });

  it('should log the query execution', async () => {
    const query = new GetTaskByIdQuery(mockTask.id);
    mockTaskRepository.findById.mockResolvedValue(mockTask);

    await handler.execute(query);

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining(mockTask.id),
      'GetTaskByIdHandler',
    );
  });
});
