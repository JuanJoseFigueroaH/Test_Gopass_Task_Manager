import { PaginationOptions } from '../../../../shared/domain/pagination';

export class GetAllProjectsQuery {
  constructor(
    public readonly options?: PaginationOptions,
    public readonly userId?: string,
  ) {}
}
