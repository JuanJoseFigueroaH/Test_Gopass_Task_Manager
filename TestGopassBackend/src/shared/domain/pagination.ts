/**
 * Pagination types for consistent paginated responses across the application
 */

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    total,
    page,
    limit,
    hasMore: page < totalPages,
    totalPages,
  };
}

export function normalizePaginationOptions(options?: PaginationOptions): Required<PaginationOptions> {
  const page = Math.max(1, options?.page ?? DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, options?.limit ?? DEFAULT_LIMIT));
  return { page, limit };
}
