export class Project {
  private readonly _id?: string;
  private _name: string;
  private _description: string | null;
  private _isActive: boolean;
  private readonly _userId: string;
  private readonly _createdAt?: Date;
  private _updatedAt?: Date;

  private constructor(props: {
    id?: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description || null;
    this._isActive = props.isActive;
    this._userId = props.userId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: { name: string; description?: string; userId: string }): Project {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }

    if (props.name.trim().length < 2) {
      throw new Error('Project name must be at least 2 characters long');
    }

    if (props.name.trim().length > 255) {
      throw new Error('Project name cannot exceed 255 characters');
    }

    return new Project({
      name: props.name.trim(),
      description: props.description?.trim() || null,
      isActive: true,
      userId: props.userId,
    });
  }

  static reconstitute(props: {
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Project {
    return new Project({
      id: props.id,
      name: props.name,
      description: props.description,
      isActive: props.isActive,
      userId: props.userId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }
    if (name.trim().length < 2) {
      throw new Error('Project name must be at least 2 characters long');
    }
    this._name = name.trim();
  }

  updateDescription(description?: string): void {
    this._description = description?.trim() || null;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }

  canBeDeleted(): boolean {
    return true;
  }

  toPlainObject() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      isActive: this._isActive,
      userId: this._userId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  toJSON() {
    return this.toPlainObject();
  }
}
