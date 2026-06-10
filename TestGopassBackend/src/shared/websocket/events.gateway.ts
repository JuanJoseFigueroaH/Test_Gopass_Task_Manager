import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface ProjectPayload {
  id?: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

interface TaskPayload {
  id?: string;
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  projectId?: string;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client);
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without authentication`);
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'your-secret-key',
      });

      client.userId = payload.sub;
      client.userEmail = payload.email;
      client.userRole = payload.role;

      this.logger.log(`Authenticated client connected: ${client.id} (${payload.email})`);
    } catch (error) {
      this.logger.warn(`Client ${client.id} connected with invalid token`);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    const token = client.handshake.auth?.token;
    if (token) {
      return token;
    }

    return null;
  }

  emitProjectCreated(project: ProjectPayload) {
    this.server.emit('project:created', project);
  }

  emitProjectUpdated(project: ProjectPayload) {
    this.server.emit('project:updated', project);
  }

  emitProjectDeleted(projectId: string) {
    this.server.emit('project:deleted', { id: projectId });
  }

  emitTaskCreated(task: TaskPayload) {
    this.server.emit('task:created', task);
  }

  emitTaskUpdated(task: TaskPayload) {
    this.server.emit('task:updated', task);
  }

  emitTaskDeleted(taskId: string, projectId: string) {
    this.server.emit('task:deleted', { id: taskId, projectId });
  }
}
