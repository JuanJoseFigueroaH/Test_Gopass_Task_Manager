import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.vo';
import { Result } from '../../../../shared/domain/result';

export interface UserProps {
  id?: string;
  email: Email;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
  }): Result<User, Error> {
    if (!props.firstName || props.firstName.trim().length === 0) {
      return Result.fail(new Error('First name is required'));
    }

    if (!props.lastName || props.lastName.trim().length === 0) {
      return Result.fail(new Error('Last name is required'));
    }

    if (!props.password || props.password.length < 6) {
      return Result.fail(new Error('Password must be at least 6 characters'));
    }

    let email: Email;
    try {
      email = Email.create(props.email);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Invalid email'));
    }

    const user = new User({
      email,
      password: props.password,
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
      role: props.role ?? Role.USER,
      isActive: true,
    });

    return Result.ok(user);
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get emailValue(): string {
    return this.props.email.getValue();
  }

  get password(): string {
    return this.props.password;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get role(): Role {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  isAdmin(): boolean {
    return this.props.role === Role.ADMIN;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  activate(): void {
    this.props.isActive = true;
  }

  changeRole(role: Role): void {
    this.props.role = role;
  }

  updatePassword(hashedPassword: string): void {
    this.props.password = hashedPassword;
  }

  updateProfile(firstName: string, lastName: string): Result<void, Error> {
    if (!firstName || firstName.trim().length === 0) {
      return Result.fail(new Error('First name is required'));
    }

    if (!lastName || lastName.trim().length === 0) {
      return Result.fail(new Error('Last name is required'));
    }

    this.props.firstName = firstName.trim();
    this.props.lastName = lastName.trim();

    return Result.ok(undefined);
  }
}
