import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TaskController } from './task.controller';
import { CreateTaskDto } from '../../application/dtos/create-task.dto';
import { UpdateTaskDto } from '../../application/dtos/update-task.dto';
import { TaskStatus, TaskPriority } from '../../domain/entities/task.entity';

describe('TaskController', () => {
  let controller: TaskController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: { del: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        projectId: '123',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      };
      const expectedResult = { id: '1', ...dto };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResult);
      expect(cacheManager.del).toHaveBeenCalledWith('tasks_all');
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const expectedResult = { data: [{ id: '1', title: 'Task 1' }], total: 1, page: 1, limit: 10 };

      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const expectedResult = { id: '1', title: 'Task 1' };

      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByProject', () => {
    it('should return tasks by project id', async () => {
      const expectedResult = { data: [{ id: '1', title: 'Task 1', projectId: '123' }], total: 1, page: 1, limit: 10 };

      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.findByProject('123', { page: 1, limit: 10 });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const dto: UpdateTaskDto = { title: 'Updated Task', status: TaskStatus.COMPLETED };
      const expectedResult = { id: '1', ...dto };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.update('1', dto);

      expect(result).toEqual(expectedResult);
      expect(cacheManager.del).toHaveBeenCalledWith('tasks_all');
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      jest.spyOn(commandBus, 'execute').mockResolvedValue(true);

      const result = await controller.remove('1');

      expect(result).toBe(true);
      expect(cacheManager.del).toHaveBeenCalledWith('tasks_all');
    });
  });
});
