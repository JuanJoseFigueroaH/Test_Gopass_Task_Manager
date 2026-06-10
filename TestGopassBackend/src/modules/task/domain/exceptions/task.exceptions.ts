import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

export class TaskNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Task with id ${id} not found`, HttpStatus.NOT_FOUND);
    this.name = 'TaskNotFoundException';
  }
}

export class TaskCannotBeStartedException extends DomainException {
  constructor(reason: string) {
    super(`Task cannot be started: ${reason}`, HttpStatus.BAD_REQUEST);
    this.name = 'TaskCannotBeStartedException';
  }
}

export class TaskCannotBeCompletedException extends DomainException {
  constructor(reason: string) {
    super(`Task cannot be completed: ${reason}`, HttpStatus.BAD_REQUEST);
    this.name = 'TaskCannotBeCompletedException';
  }
}

export class TaskCannotBeCancelledException extends DomainException {
  constructor(reason: string) {
    super(`Task cannot be cancelled: ${reason}`, HttpStatus.BAD_REQUEST);
    this.name = 'TaskCannotBeCancelledException';
  }
}

export class TaskValidationException extends DomainException {
  constructor(field: string, message: string) {
    super(`Task validation failed for ${field}: ${message}`, HttpStatus.BAD_REQUEST);
    this.name = 'TaskValidationException';
  }
}

export class TaskAlreadyExistsException extends DomainException {
  constructor(title: string, projectId: string) {
    super(`Task with title "${title}" already exists in project ${projectId}`, HttpStatus.CONFLICT);
    this.name = 'TaskAlreadyExistsException';
  }
}
