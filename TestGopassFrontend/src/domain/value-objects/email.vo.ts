import { Result, ValidationError } from '../types/result';

export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {}

  static create(email: string): Result<Email, ValidationError> {
    if (!email || email.trim().length === 0) {
      return Result.fail(new ValidationError('email', 'Email cannot be empty'));
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(trimmedEmail)) {
      return Result.fail(new ValidationError('email', 'Invalid email format'));
    }

    return Result.ok(new Email(trimmedEmail));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
