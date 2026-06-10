export class TaskDescription {
  private static readonly MAX_LENGTH = 5000;

  private constructor(private readonly value: string | null) {}

  static create(description?: string | null): TaskDescription {
    if (!description) {
      return new TaskDescription(null);
    }

    const trimmed = description.trim();

    if (trimmed.length > TaskDescription.MAX_LENGTH) {
      throw new Error(
        `Task description cannot exceed ${TaskDescription.MAX_LENGTH} characters`,
      );
    }

    return new TaskDescription(trimmed.length > 0 ? trimmed : null);
  }

  getValue(): string | null {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value === null;
  }

  toString(): string {
    return this.value || '';
  }
}
