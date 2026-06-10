import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CACHE_INVALIDATION_KEY,
  CacheInvalidationOptions,
} from './cache-invalidation.decorator';
import { CacheKeys } from './cache-keys';

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<CacheInvalidationOptions>(
      CACHE_INVALIDATION_KEY,
      context.getHandler(),
    );

    if (!options) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (result) => {
        await this.invalidateCache(context, options, result);
      }),
    );
  }

  private async invalidateCache(
    context: ExecutionContext,
    options: CacheInvalidationOptions,
    result: Record<string, unknown>,
  ): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const keysToInvalidate: string[] = [];

    for (const pattern of options.patterns) {
      if (pattern === 'tasks:all') {
        keysToInvalidate.push(CacheKeys.TASKS_ALL);
      } else if (pattern === 'projects:all') {
        keysToInvalidate.push(CacheKeys.PROJECTS_ALL);
      } else if (pattern === 'tasks:project:*') {
        const projectId = this.extractProjectId(request, result, options);
        if (projectId) {
          keysToInvalidate.push(CacheKeys.TASKS_BY_PROJECT(projectId));
        }
      } else if (pattern === 'tasks:id:*') {
        const taskId = this.extractTaskId(request, result, options);
        if (taskId) {
          keysToInvalidate.push(CacheKeys.TASK_BY_ID(taskId));
        }
      } else if (pattern === 'projects:id:*') {
        const projectId = this.extractProjectId(request, result, options);
        if (projectId) {
          keysToInvalidate.push(CacheKeys.PROJECT_BY_ID(projectId));
        }
      }
    }

    await Promise.all(
      keysToInvalidate.map((key) => this.cacheManager.del(key)),
    );
  }

  private extractProjectId(
    request: Request,
    result: Record<string, unknown>,
    options: CacheInvalidationOptions,
  ): string | null {
    if (request.params?.projectId) {
      return request.params.projectId;
    }
    if (request.body?.projectId) {
      return request.body.projectId;
    }
    if (result?.projectId) {
      return result.projectId as string;
    }
    if (request.params?.id && options.extractProjectId) {
      return request.params.id;
    }
    return null;
  }

  private extractTaskId(
    request: Request,
    result: Record<string, unknown>,
    options: CacheInvalidationOptions,
  ): string | null {
    if (request.params?.id && options.extractTaskId) {
      return request.params.id;
    }
    if (result?.id) {
      return result.id as string;
    }
    return null;
  }
}
