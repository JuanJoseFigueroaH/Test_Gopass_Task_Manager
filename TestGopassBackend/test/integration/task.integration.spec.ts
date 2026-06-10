import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TaskStatus, TaskPriority } from '../../src/modules/task/domain/models/task.model';

describe('Task Integration Tests', () => {
  let app: INestApplication;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // Create a project first for task tests
    const projectResponse = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .send({ name: 'Integration Test Project', description: 'Test project for integration tests' });
    
    projectId = projectResponse.body.data?.id || projectResponse.body.id;
  });

  afterAll(async () => {
    // Cleanup: delete test project
    if (projectId) {
      await request(app.getHttpServer()).delete(`/api/v1/projects/${projectId}`);
    }
    await app.close();
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Integration Test Task',
        projectId,
        description: 'Task created during integration test',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toBeDefined();
      taskId = response.body.data?.id || response.body.id;
      expect(taskId).toBeDefined();
    });

    it('should fail to create task without title', async () => {
      const createTaskDto = {
        projectId,
        description: 'Task without title',
      };

      await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send(createTaskDto)
        .expect(400);
    });

    it('should fail to create task without projectId', async () => {
      const createTaskDto = {
        title: 'Task without project',
        description: 'This should fail',
      };

      await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send(createTaskDto)
        .expect(400);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should return paginated tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/tasks')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
      expect(response.body.total).toBeDefined();
      expect(response.body.hasMore).toBeDefined();
    });

    it('should return tasks with default pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/tasks')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return a task by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${taskId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      const task = response.body.data || response.body;
      expect(task.id).toBe(taskId);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/tasks/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /api/v1/tasks/project/:projectId', () => {
    it('should return paginated tasks for a project', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/tasks/project/${projectId}`)
        .query({ page: 1, limit: 5 })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(5);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update a task', async () => {
      const updateTaskDto = {
        title: 'Updated Integration Test Task',
        status: TaskStatus.IN_PROGRESS,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/tasks/${taskId}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body).toBeDefined();
      const task = response.body.data || response.body;
      expect(task.title).toBe('Updated Integration Test Task');
    });

    it('should return 404 for updating non-existent task', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/tasks/non-existent-id')
        .send({ title: 'Updated Title' })
        .expect(404);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete a task', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/tasks/${taskId}`)
        .expect(200);
    });

    it('should return 404 for deleting non-existent task', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/tasks/non-existent-id')
        .expect(404);
    });
  });
});
