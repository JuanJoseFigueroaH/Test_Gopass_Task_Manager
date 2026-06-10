export class ProjectDescription {
  private static readonly MAX_LENGTH = 1000;

  private constructor(private readonly value: string | null) {}

  static create(description?: string | null): ProjectDescription {
    if (!description || description.trim().length === 0) {
      return new ProjectDescription(null);
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length > ProjectDescription.MAX_LENGTH) {
      throw new Error(
        `Project description cannot exceed ${ProjectDescription.MAX_LENGTH} characters`,
      );
    }

    return new ProjectDescription(trimmedDescription);
  }

  getValue(): string | null {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value === null;
  }

  equals(other: ProjectDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value ?? '';
  }
}
