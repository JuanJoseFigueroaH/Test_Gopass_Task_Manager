import { PaginationOptions } from '../../../../shared/domain/pagination';

export class GetTasksByProjectQuery {
  constructor(
    public readonly projectId: string,
    public readonly options?: PaginationOptions,
  ) {}
}
