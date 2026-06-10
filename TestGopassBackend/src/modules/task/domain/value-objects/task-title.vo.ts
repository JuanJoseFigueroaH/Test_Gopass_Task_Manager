export class TaskTitle {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 255;

  private constructor(private readonly value: string) {}

  static create(title: string): TaskTitle {
    if (!title || title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < TaskTitle.MIN_LENGTH) {
      throw new Error(
        `Task title must be at least ${TaskTitle.MIN_LENGTH} characters long`,
      );
    }

    if (trimmedTitle.length > TaskTitle.MAX_LENGTH) {
      throw new Error(
        `Task title cannot exceed ${TaskTitle.MAX_LENGTH} characters`,
      );
    }

    return new TaskTitle(trimmedTitle);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
