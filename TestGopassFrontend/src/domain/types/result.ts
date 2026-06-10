export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export const Result = {
  ok<T>(data: T): Result<T, never> {
    return { success: true, data };
  },

  fail<E>(error: E): Result<never, E> {
    return { success: false, error };
  },

  isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
    return result.success === true;
  },

  isFail<T, E>(result: Result<T, E>): result is { success: false; error: E } {
    return result.success === false;
  },

  map<T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> {
    if (result.success) {
      return Result.ok(fn(result.data));
    }
    return result;
  },

  flatMap<T, U, E>(result: Result<T, E>, fn: (data: T) => Result<U, E>): Result<U, E> {
    if (result.success) {
      return fn(result.data);
    }
    return result;
  },

  getOrThrow<T, E>(result: Result<T, E>): T {
    if (result.success) {
      return result.data;
    }
    throw result.error;
  },

  getOrDefault<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (result.success) {
      return result.data;
    }
    return defaultValue;
  },

  async fromAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
    try {
      const data = await fn();
      return Result.ok(data);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const message = axiosError.response?.data?.message;
        if (message) {
          return Result.fail(new Error(message));
        }
      }
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  },

  fromSync<T>(fn: () => T): Result<T, Error> {
    try {
      const data = fn();
      return Result.ok(data);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  },
};

export class DomainError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends DomainError {
  constructor(field: string, message: string) {
    super(`Validation failed for ${field}: ${message}`, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NetworkError extends DomainError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends DomainError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}
