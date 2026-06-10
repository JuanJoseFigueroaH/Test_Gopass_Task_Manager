import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProjectController } from './project.controller';
import { CreateProjectDto } from '../../application/dtos/create-project.dto';
import { UpdateProjectDto } from '../../application/dtos/update-project.dto';
import { UserEntity } from '../../../auth/domain/entities/user.entity';

describe('ProjectController', () => {
  let controller: ProjectController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
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

    controller = module.get<ProjectController>(ProjectController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const dto: CreateProjectDto = { name: 'Test Project', description: 'Test' };
      const mockUser = { id: 'user-123', email: 'test@test.com' } as UserEntity;
      const expectedResult = { id: '1', ...dto, userId: mockUser.id };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.create(dto, mockUser);

      expect(result).toEqual(expectedResult);
      expect(cacheManager.del).toHaveBeenCalledWith('projects_all');
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const mockUser = { id: 'user-123', email: 'test@test.com' } as UserEntity;
      const expectedResult = { data: [{ id: '1', name: 'Project 1' }], total: 1, page: 1, limit: 10 };

      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.findAll({ page: 1, limit: 10 }, mockUser);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const expectedResult = { id: '1', name: 'Project 1' };

      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const dto: UpdateProjectDto = { name: 'Updated Project' };
      const expectedResult = { id: '1', name: 'Updated Project' };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.update('1', dto);

      expect(result).toEqual(expectedResult);
      expect(cacheManager.del).toHaveBeenCalledWith('projects_all');
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      jest.spyOn(commandBus, 'execute').mockResolvedValue(true);

      const result = await controller.remove('1');

      expect(result).toBe(true);
      expect(cacheManager.del).toHaveBeenCalledWith('projects_all');
    });
  });
});
