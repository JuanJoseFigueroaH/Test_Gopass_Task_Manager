import { Test, TestingModule } from '@nestjs/testing';
import { CreateProjectHandler } from './create-project.handler';
import { PROJECT_REPOSITORY } from '../../domain/ports/project.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logger/logger.service';
import { CreateProjectCommand } from '../commands/create-project.command';

describe('CreateProjectHandler', () => {
  let handler: CreateProjectHandler;
  let mockProjectRepository: any;
  let mockLogger: any;

  beforeEach(async () => {
    mockProjectRepository = {
      create: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProjectHandler,
        { provide: PROJECT_REPOSITORY, useValue: mockProjectRepository },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    handler = module.get<CreateProjectHandler>(CreateProjectHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create a project successfully', async () => {
    const command = new CreateProjectCommand('Test Project', 'Test Description', 'user-123');
    const expectedProject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Project',
      description: 'Test Description',
      userId: 'user-123',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjectRepository.create.mockResolvedValue(expectedProject);

    const result = await handler.execute(command);

    expect(mockProjectRepository.create).toHaveBeenCalledWith({
      name: 'Test Project',
      description: 'Test Description',
      userId: 'user-123',
    });
    expect(mockLogger.log).toHaveBeenCalledTimes(2);
  });

  it('should create a project without description', async () => {
    const command = new CreateProjectCommand('Test Project', undefined, 'user-123');
    const expectedProject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Project',
      description: undefined,
      userId: 'user-123',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjectRepository.create.mockResolvedValue(expectedProject);

    const result = await handler.execute(command);

    expect(mockProjectRepository.create).toHaveBeenCalledWith({
      name: 'Test Project',
      description: undefined,
      userId: 'user-123',
    });
  });
});
