import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

export interface LogContext {
  context?: string;
  requestId?: string;
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  duration?: number;
  method?: string;
  path?: string;
  statusCode?: number;
  ip?: string;
  userAgent?: string;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  [key: string]: unknown;
}

export interface HttpLogContext extends LogContext {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  ip?: string;
  userAgent?: string;
}

export interface ErrorLogContext extends LogContext {
  errorCode?: string;
  errorType?: string;
  stack?: string;
}

const isProduction = process.env.NODE_ENV === 'production';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.errors({ stack: true }),
        isProduction ? this.productionFormat() : this.developmentFormat(),
      ),
      defaultMeta: { 
        service: 'gopass-api',
        environment: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
        hostname: process.env.HOSTNAME || 'localhost',
      },
      transports: [
        new winston.transports.Console({
          format: isProduction
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
                  const metaStr = Object.keys(meta).length > 2 ? ` ${JSON.stringify(meta)}` : '';
                  return `${timestamp} [${level}] [${context || 'App'}] ${message}${metaStr}`;
                }),
              ),
        }),
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          maxsize: 10 * 1024 * 1024,
          maxFiles: 10,
        }),
      ],
    });
  }

  private productionFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.json(),
      winston.format((info) => {
        info['@timestamp'] = info.timestamp;
        info.log = { level: info.level };
        return info;
      })(),
    );
  }

  private developmentFormat(): winston.Logform.Format {
    return winston.format.json();
  }

  log(message: string, context?: string | LogContext): void {
    const meta = typeof context === 'string' ? { context } : context;
    this.logger.info(message, meta);
  }

  error(message: string, trace?: string, context?: string | LogContext): void {
    const meta = typeof context === 'string' ? { context, trace } : { ...context, trace };
    this.logger.error(message, meta);
  }

  warn(message: string, context?: string | LogContext): void {
    const meta = typeof context === 'string' ? { context } : context;
    this.logger.warn(message, meta);
  }

  debug(message: string, context?: string | LogContext): void {
    const meta = typeof context === 'string' ? { context } : context;
    this.logger.debug(message, meta);
  }

  verbose(message: string, context?: string | LogContext): void {
    const meta = typeof context === 'string' ? { context } : context;
    this.logger.verbose(message, meta);
  }

  logAction(action: string, entity: string, entityId: string, context?: LogContext): void {
    this.logger.info(`${action} ${entity}`, {
      action,
      entity,
      entityId,
      ...context,
    });
  }

  logDuration(message: string, startTime: number, context?: LogContext): void {
    const duration = Date.now() - startTime;
    this.logger.info(message, {
      duration,
      durationMs: `${duration}ms`,
      ...context,
    });
  }

  logHttp(context: HttpLogContext): void {
    const level = context.statusCode >= 500 ? 'error' : context.statusCode >= 400 ? 'warn' : 'info';
    this.logger[level](`${context.method} ${context.path} ${context.statusCode}`, {
      type: 'http',
      ...context,
    });
  }

  logError(error: Error, context?: ErrorLogContext): void {
    this.logger.error(error.message, {
      type: 'error',
      errorType: error.name,
      errorCode: context?.errorCode,
      stack: error.stack,
      ...context,
    });
  }

  logAuth(action: 'login' | 'logout' | 'register' | 'token_refresh', userId?: string, context?: LogContext): void {
    this.logger.info(`Auth: ${action}`, {
      type: 'auth',
      action,
      userId,
      ...context,
    });
  }

  logDatabase(operation: string, entity: string, duration: number, context?: LogContext): void {
    this.logger.debug(`DB: ${operation} ${entity}`, {
      type: 'database',
      operation,
      entity,
      duration,
      durationMs: `${duration}ms`,
      ...context,
    });
  }

  logCache(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, context?: LogContext): void {
    this.logger.debug(`Cache: ${operation} ${key}`, {
      type: 'cache',
      operation,
      cacheKey: key,
      ...context,
    });
  }

  child(defaultMeta: LogContext): LoggerService {
    const childLogger = new LoggerService();
    childLogger.logger = this.logger.child(defaultMeta);
    return childLogger;
  }
}
