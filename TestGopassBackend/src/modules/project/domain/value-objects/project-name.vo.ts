export class ProjectName {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  private constructor(private readonly value: string) {}

  static create(name: string): ProjectName {
    if (!name || name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }

    const trimmedName = name.trim();

    if (trimmedName.length < ProjectName.MIN_LENGTH) {
      throw new Error(
        `Project name must be at least ${ProjectName.MIN_LENGTH} characters long`,
      );
    }

    if (trimmedName.length > ProjectName.MAX_LENGTH) {
      throw new Error(
        `Project name cannot exceed ${ProjectName.MAX_LENGTH} characters`,
      );
    }

    return new ProjectName(trimmedName);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProjectName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
