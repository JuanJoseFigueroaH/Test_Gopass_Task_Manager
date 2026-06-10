import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('WebSocket Events (e2e)', () => {
  let app: INestApplication;
  let clientSocket: Socket;
  let createdProjectId: string;
  const WS_URL = 'http://localhost:3001';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    await app.listen(3001);
  });

  afterAll(async () => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
    await app.close();
  });

  beforeEach((done) => {
    clientSocket = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach(() => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
  });

  describe('Project WebSocket Events', () => {
    it('should receive project:created event when project is created', (done) => {
      clientSocket.on('project:created', (data: any) => {
        expect(data).toHaveProperty('id');
        expect(data.name).toBe('WebSocket Test Project');
        createdProjectId = data.id;
        done();
      });

      request(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'WebSocket Test Project', description: 'Test' })
        .expect(201)
        .end((err: Error | null) => {
          if (err) done(err);
        });
    });

    it('should receive project:updated event when project is updated', (done) => {
      clientSocket.on('project:updated', (data: any) => {
        expect(data.id).toBe(createdProjectId);
        expect(data.name).toBe('Updated WebSocket Project');
        done();
      });

      request(app.getHttpServer())
        .put(`/api/v1/projects/${createdProjectId}`)
        .send({ name: 'Updated WebSocket Project' })
        .expect(200)
        .end((err: Error | null) => {
          if (err) done(err);
        });
    });

    it('should receive project:deleted event when project is deleted', (done) => {
      clientSocket.on('project:deleted', (data: any) => {
        expect(data.id).toBe(createdProjectId);
        done();
      });

      request(app.getHttpServer())
        .delete(`/api/v1/projects/${createdProjectId}`)
        .expect(200)
        .end((err: Error | null) => {
          if (err) done(err);
        });
    });
  });

  describe('Task WebSocket Events', () => {
    let taskProjectId: string;
    let createdTaskId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'Task WebSocket Project' });
      taskProjectId = response.body.id;
    });

    afterAll(async () => {
      if (taskProjectId) {
        await request(app.getHttpServer())
          .delete(`/api/v1/projects/${taskProjectId}`);
      }
    });

    it('should receive task:created event when task is created', (done) => {
      clientSocket.on('task:created', (data: any) => {
        expect(data).toHaveProperty('id');
        expect(data.title).toBe('WebSocket Test Task');
        expect(data.projectId).toBe(taskProjectId);
        createdTaskId = data.id;
        done();
      });

      request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send({
          title: 'WebSocket Test Task',
          projectId: taskProjectId,
          description: 'Test task for WebSocket',
        })
        .expect(201)
        .end((err: Error | null) => {
          if (err) done(err);
        });
    });

    it('should receive task:updated event when task is updated', (done) => {
      clientSocket.on('task:updated', (data: any) => {
        expect(data.id).toBe(createdTaskId);
        expect(data.title).toBe('Updated WebSocket Task');
        expect(data.status).toBe('IN_PROGRESS');
        done();
      });

      request(app.getHttpServer())
        .put(`/api/v1/tasks/${createdTaskId}`)
        .send({ title: 'Updated WebSocket Task', status: 'IN_PROGRESS' })
        .expect(200)
        .end((err: Error | null) => {
          if (err) done(err);
        });
    });

    it('should receive task:deleted event when task is deleted', (done) => {
      clientSocket.on('task:deleted', (data: any) => {
        expect(data.id).toBe(createdTaskId);
        expect(data.projectId).toBe(taskProjectId);
        done();
      });

      request(app.getHttpServer())
        .delete(`/api/v1/tasks/${createdTaskId}`)
        .expect(200)
        .end((err: Error | null) => {
          if (err) done(err);
        });
    });
  });

  describe('WebSocket Connection', () => {
    it('should connect successfully', (done) => {
      const testSocket = io(WS_URL, {
        transports: ['websocket'],
      });

      testSocket.on('connect', () => {
        expect(testSocket.connected).toBe(true);
        testSocket.disconnect();
        done();
      });
    });

    it('should handle disconnection gracefully', (done) => {
      const testSocket = io(WS_URL, {
        transports: ['websocket'],
      });

      testSocket.on('connect', () => {
        testSocket.disconnect();
      });

      testSocket.on('disconnect', () => {
        expect(testSocket.connected).toBe(false);
        done();
      });
    });
  });
});
