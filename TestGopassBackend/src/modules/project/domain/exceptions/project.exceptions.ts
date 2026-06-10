import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

export class ProjectNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Project with id ${id} not found`, HttpStatus.NOT_FOUND);
    this.name = 'ProjectNotFoundException';
  }
}

export class ProjectValidationException extends DomainException {
  constructor(field: string, message: string) {
    super(`Project validation failed for ${field}: ${message}`, HttpStatus.BAD_REQUEST);
    this.name = 'ProjectValidationException';
  }
}

export class ProjectAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Project with name "${name}" already exists`, HttpStatus.CONFLICT);
    this.name = 'ProjectAlreadyExistsException';
  }
}

export class ProjectCannotBeDeletedException extends DomainException {
  constructor(reason: string) {
    super(`Project cannot be deleted: ${reason}`, HttpStatus.BAD_REQUEST);
    this.name = 'ProjectCannotBeDeletedException';
  }
}

export class ProjectHasActiveTasksException extends DomainException {
  constructor(projectId: string, taskCount: number) {
    super(`Project ${projectId} has ${taskCount} active tasks and cannot be deleted`, HttpStatus.CONFLICT);
    this.name = 'ProjectHasActiveTasksException';
  }
}
