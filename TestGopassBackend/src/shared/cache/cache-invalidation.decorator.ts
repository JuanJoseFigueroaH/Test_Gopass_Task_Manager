import { SetMetadata } from '@nestjs/common';

export const CACHE_INVALIDATION_KEY = 'cache_invalidation';

export interface CacheInvalidationOptions {
  patterns: string[];
  extractProjectId?: boolean;
  extractTaskId?: boolean;
}

export const InvalidateCache = (options: CacheInvalidationOptions) =>
  SetMetadata(CACHE_INVALIDATION_KEY, options);
