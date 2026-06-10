import { Result, ValidationError } from '../types/result';

export class TaskTitle {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 255;

  private constructor(private readonly value: string) {}

  static create(title: string): Result<TaskTitle, ValidationError> {
    if (!title || title.trim().length === 0) {
      return Result.fail(new ValidationError('title', 'Task title cannot be empty'));
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < TaskTitle.MIN_LENGTH) {
      return Result.fail(
        new ValidationError('title', `Task title must be at least ${TaskTitle.MIN_LENGTH} characters long`)
      );
    }

    if (trimmedTitle.length > TaskTitle.MAX_LENGTH) {
      return Result.fail(
        new ValidationError('title', `Task title cannot exceed ${TaskTitle.MAX_LENGTH} characters`)
      );
    }

    return Result.ok(new TaskTitle(trimmedTitle));
  }

  getValue(): string {
    return this.value;
  }

  get length(): number {
    return this.value.length;
  }

  equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
