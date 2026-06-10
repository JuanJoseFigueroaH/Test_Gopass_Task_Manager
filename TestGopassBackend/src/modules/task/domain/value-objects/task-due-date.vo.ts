export class TaskDueDate {
  private constructor(private readonly value: Date | null) {}

  static create(dueDate?: Date | string | null): TaskDueDate {
    if (!dueDate) {
      return new TaskDueDate(null);
    }

    const date = dueDate instanceof Date ? dueDate : new Date(dueDate);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid due date format');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      throw new Error('Due date cannot be in the past');
    }

    return new TaskDueDate(date);
  }

  static fromExisting(dueDate?: Date | null): TaskDueDate {
    return new TaskDueDate(dueDate || null);
  }

  getValue(): Date | null {
    return this.value;
  }

  isOverdue(): boolean {
    if (!this.value) return false;
    return this.value < new Date();
  }

  toString(): string {
    return this.value ? this.value.toISOString() : '';
  }
}
