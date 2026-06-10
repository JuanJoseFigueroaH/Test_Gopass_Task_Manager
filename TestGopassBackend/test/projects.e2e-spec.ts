import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Projects (e2e)', () => {
  let app: INestApplication;
  let createdProjectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', async () => {
      const createProjectDto = {
        name: 'E2E Test Project',
        description: 'Project created during E2E testing',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .send(createProjectDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createProjectDto.name);
      expect(response.body.description).toBe(createProjectDto.description);
      expect(response.body.isActive).toBe(true);

      createdProjectId = response.body.id;
    });

    it('should fail to create project without name', async () => {
      const createProjectDto = {
        description: 'Project without name',
      };

      await request(app.getHttpServer())
        .post('/api/v1/projects')
        .send(createProjectDto)
        .expect(400);
    });

    it('should fail to create project with empty name', async () => {
      const createProjectDto = {
        name: '',
        description: 'Project with empty name',
      };

      await request(app.getHttpServer())
        .post('/api/v1/projects')
        .send(createProjectDto)
        .expect(400);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return all projects', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a project by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${createdProjectId}`)
        .expect(200);

      expect(response.body.id).toBe(createdProjectId);
      expect(response.body.name).toBe('E2E Test Project');
    });

    it('should return 404 for non-existent project', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/projects/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PUT /api/v1/projects/:id', () => {
    it('should update a project', async () => {
      const updateProjectDto = {
        name: 'Updated E2E Project',
        description: 'Updated description',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/projects/${createdProjectId}`)
        .send(updateProjectDto)
        .expect(200);

      expect(response.body.name).toBe(updateProjectDto.name);
      expect(response.body.description).toBe(updateProjectDto.description);
    });

    it('should return 404 when updating non-existent project', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/projects/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete a project', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/projects/${createdProjectId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent project', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/projects/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
