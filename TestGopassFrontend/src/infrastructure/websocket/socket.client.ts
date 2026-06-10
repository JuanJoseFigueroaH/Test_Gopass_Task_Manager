import { io, Socket } from 'socket.io-client';
import { Project } from '@/domain/entities/project.entity';
import { Task } from '@/domain/entities/task.entity';

type SocketEventData = Project | Task | { id: string } | { id: string; projectId: string };
type SocketCallback<T = SocketEventData> = (data: T) => void;

class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<SocketCallback>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    const url = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
    
    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('project:created', (data: Project) => this.emit('project:created', data));
    this.socket.on('project:updated', (data: Project) => this.emit('project:updated', data));
    this.socket.on('project:deleted', (data: { id: string }) => this.emit('project:deleted', data));
    this.socket.on('task:created', (data: Task) => this.emit('task:created', data));
    this.socket.on('task:updated', (data: Task) => this.emit('task:updated', data));
    this.socket.on('task:deleted', (data: { id: string; projectId: string }) => this.emit('task:deleted', data));
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  private emit(event: string, data: SocketEventData) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  on<T = SocketEventData>(event: string, callback: SocketCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as SocketCallback);

    return () => {
      this.listeners.get(event)?.delete(callback as SocketCallback);
    };
  }

  off<T = SocketEventData>(event: string, callback: SocketCallback<T>) {
    this.listeners.get(event)?.delete(callback as SocketCallback);
  }
}

export const socketClient = new SocketClient();
