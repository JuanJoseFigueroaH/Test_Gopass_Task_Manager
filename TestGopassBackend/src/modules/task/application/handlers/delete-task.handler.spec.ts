import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTaskHandler } from './delete-task.handler';
import { TASK_REPOSITORY } from '../../domain/ports/task.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { DeleteTaskCommand } from '../commands/delete-task.command';
import { TaskStatus, TaskPriority } from '../../domain/models/task.model';
import { NotFoundException } from '../../../../shared/domain/exceptions/domain.exception';

describe('DeleteTaskHandler', () => {
  let handler: DeleteTaskHandler;
  let mockTaskRepository: any;
  let mockLogger: any;

  const mockTask = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Task to Delete',
    description: 'Description',
    projectId: '123e4567-e89b-12d3-a456-426614174000',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockTaskRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskHandler,
        { provide: TASK_REPOSITORY, useValue: mockTaskRepository },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    handler = module.get<DeleteTaskHandler>(DeleteTaskHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should delete a task successfully', async () => {
    const command = new DeleteTaskCommand(mockTask.id);

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockTaskRepository.delete.mockResolvedValue(true);

    const result = await handler.execute(command);

    expect(result).toBe(true);
    expect(mockTaskRepository.findById).toHaveBeenCalledWith(mockTask.id);
    expect(mockTaskRepository.delete).toHaveBeenCalledWith(mockTask.id);
    expect(mockLogger.log).toHaveBeenCalled();
  });

  it('should throw NotFoundException when task does not exist', async () => {
    const command = new DeleteTaskCommand('non-existent-id');
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(mockTaskRepository.delete).not.toHaveBeenCalled();
  });

  it('should return false when delete fails', async () => {
    const command = new DeleteTaskCommand(mockTask.id);

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockTaskRepository.delete.mockResolvedValue(false);

    const result = await handler.execute(command);

    expect(result).toBe(false);
  });

  it('should log deletion attempt', async () => {
    const command = new DeleteTaskCommand(mockTask.id);

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockTaskRepository.delete.mockResolvedValue(true);

    await handler.execute(command);

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining(mockTask.id),
      'DeleteTaskHandler',
    );
  });
});
