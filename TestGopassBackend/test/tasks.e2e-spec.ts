import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let createdProjectId: string;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // Create a project first for task tests
    const projectResponse = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .send({ name: 'Task Test Project', description: 'Project for task E2E tests' });
    
    createdProjectId = projectResponse.body.id;
  });

  afterAll(async () => {
    // Clean up: delete the test project
    if (createdProjectId) {
      await request(app.getHttpServer())
        .delete(`/api/v1/projects/${createdProjectId}`);
    }
    await app.close();
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'E2E Test Task',
        description: 'Task created during E2E testing',
        projectId: createdProjectId,
        priority: 'HIGH',
        status: 'PENDING',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createTaskDto.title);
      expect(response.body.description).toBe(createTaskDto.description);
      expect(response.body.projectId).toBe(createdProjectId);
      expect(response.body.priority).toBe('HIGH');
      expect(response.body.status).toBe('PENDING');

      createdTaskId = response.body.id;
    });

    it('should fail to create task without title', async () => {
      const createTaskDto = {
        description: 'Task without title',
        projectId: createdProjectId,
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

    it('should create task with due date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const createTaskDto = {
        title: 'Task with due date',
        projectId: createdProjectId,
        dueDate: futureDate.toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body.dueDate).toBeDefined();
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/tasks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return a task by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${createdTaskId}`)
        .expect(200);

      expect(response.body.id).toBe(createdTaskId);
      expect(response.body.title).toBe('E2E Test Task');
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('GET /api/v1/tasks/project/:projectId', () => {
    it('should return tasks by project id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/tasks/project/${createdProjectId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].projectId).toBe(createdProjectId);
    });

    it('should return empty array for project with no tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/tasks/project/00000000-0000-0000-0000-000000000000')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update a task', async () => {
      const updateTaskDto = {
        title: 'Updated E2E Task',
        description: 'Updated description',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/tasks/${createdTaskId}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body.title).toBe(updateTaskDto.title);
      expect(response.body.description).toBe(updateTaskDto.description);
      expect(response.body.status).toBe('IN_PROGRESS');
      expect(response.body.priority).toBe('URGENT');
    });

    it('should update only status', async () => {
      const updateTaskDto = {
        status: 'COMPLETED',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/tasks/${createdTaskId}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body.status).toBe('COMPLETED');
      expect(response.body.title).toBe('Updated E2E Task');
    });

    it('should return 404 when updating non-existent task', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Test' })
        .expect(404);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete a task', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/tasks/${createdTaskId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent task', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
