import { TaskTitle } from '../value-objects/task-title.vo';
import { TaskDescription } from '../value-objects/task-description.vo';
import { TaskDueDate } from '../value-objects/task-due-date.vo';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface TaskProps {
  id?: string;
  title: TaskTitle;
  description: TaskDescription;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: TaskDueDate;
  projectId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  private readonly _id?: string;
  private _title: TaskTitle;
  private _description: TaskDescription;
  private _status: TaskStatus;
  private _priority: TaskPriority;
  private _dueDate: TaskDueDate;
  private readonly _projectId: string;
  private readonly _createdAt?: Date;
  private _updatedAt?: Date;

  private constructor(props: TaskProps) {
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._status = props.status;
    this._priority = props.priority;
    this._dueDate = props.dueDate;
    this._projectId = props.projectId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date | string;
    projectId: string;
  }): Task {
    if (!props.projectId) {
      throw new Error('Project ID is required');
    }

    return new Task({
      title: TaskTitle.create(props.title),
      description: TaskDescription.create(props.description),
      status: props.status || TaskStatus.PENDING,
      priority: props.priority || TaskPriority.MEDIUM,
      dueDate: TaskDueDate.create(props.dueDate),
      projectId: props.projectId,
    });
  }

  static reconstitute(props: {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date | null;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return new Task({
      id: props.id,
      title: TaskTitle.create(props.title),
      description: TaskDescription.create(props.description),
      status: props.status,
      priority: props.priority,
      dueDate: TaskDueDate.fromExisting(props.dueDate),
      projectId: props.projectId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get id(): string | undefined {
    return this._id;
  }

  get title(): string {
    return this._title.getValue();
  }

  get description(): string | null {
    return this._description.getValue();
  }

  get status(): TaskStatus {
    return this._status;
  }

  get priority(): TaskPriority {
    return this._priority;
  }

  get dueDate(): Date | null {
    return this._dueDate.getValue();
  }

  get projectId(): string {
    return this._projectId;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  updateTitle(title: string): void {
    this._title = TaskTitle.create(title);
  }

  updateDescription(description?: string): void {
    this._description = TaskDescription.create(description);
  }

  updateDueDate(dueDate?: Date | string): void {
    this._dueDate = TaskDueDate.create(dueDate);
  }

  start(): void {
    if (this._status === TaskStatus.COMPLETED) {
      throw new Error('Cannot start a completed task');
    }
    if (this._status === TaskStatus.CANCELLED) {
      throw new Error('Cannot start a cancelled task');
    }
    this._status = TaskStatus.IN_PROGRESS;
  }

  complete(): void {
    if (this._status === TaskStatus.CANCELLED) {
      throw new Error('Cannot complete a cancelled task');
    }
    this._status = TaskStatus.COMPLETED;
  }

  cancel(): void {
    if (this._status === TaskStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed task');
    }
    this._status = TaskStatus.CANCELLED;
  }

  reopen(): void {
    if (this._status !== TaskStatus.COMPLETED && this._status !== TaskStatus.CANCELLED) {
      throw new Error('Can only reopen completed or cancelled tasks');
    }
    this._status = TaskStatus.PENDING;
  }

  changePriority(priority: TaskPriority): void {
    this._priority = priority;
  }

  isOverdue(): boolean {
    return this._dueDate.isOverdue() && this._status !== TaskStatus.COMPLETED;
  }

  canBeDeleted(): boolean {
    return this._status !== TaskStatus.IN_PROGRESS;
  }

  toPlainObject() {
    return {
      id: this._id,
      title: this.title,
      description: this.description,
      status: this._status,
      priority: this._priority,
      dueDate: this.dueDate,
      projectId: this._projectId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  toJSON() {
    return this.toPlainObject();
  }
}
