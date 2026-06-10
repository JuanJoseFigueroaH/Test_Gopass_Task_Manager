import { PaginationOptions } from '../../../../shared/domain/pagination';

export class GetAllTasksQuery {
  constructor(public readonly options?: PaginationOptions) {}
}
