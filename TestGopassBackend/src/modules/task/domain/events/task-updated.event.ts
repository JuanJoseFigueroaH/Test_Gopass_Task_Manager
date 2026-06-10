import { Task } from '../models/task.model';

export class TaskUpdatedEvent {
  constructor(public readonly task: Task) {}
}
