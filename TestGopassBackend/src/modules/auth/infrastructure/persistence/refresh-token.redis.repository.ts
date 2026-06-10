import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RefreshTokenRepositoryPort, RefreshTokenData } from '../../domain/ports/refresh-token.repository.port';

const REFRESH_TOKEN_PREFIX = 'refresh_token:';
const USER_TOKENS_PREFIX = 'user_tokens:';
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class RefreshTokenRedisRepository implements RefreshTokenRepositoryPort {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async save(token: string, userId: string, expiresAt: Date): Promise<void> {
    const ttl = expiresAt.getTime() - Date.now();
    
    await this.cacheManager.set(
      `${REFRESH_TOKEN_PREFIX}${token}`,
      JSON.stringify({ userId, expiresAt: expiresAt.toISOString() }),
      ttl > 0 ? ttl : SEVEN_DAYS_IN_MS,
    );

    const userTokensKey = `${USER_TOKENS_PREFIX}${userId}`;
    const existingTokens = await this.cacheManager.get<string>(userTokensKey);
    const tokens: string[] = existingTokens ? JSON.parse(existingTokens) : [];
    tokens.push(token);
    
    await this.cacheManager.set(userTokensKey, JSON.stringify(tokens), SEVEN_DAYS_IN_MS);
  }

  async findByToken(token: string): Promise<RefreshTokenData | null> {
    const data = await this.cacheManager.get<string>(`${REFRESH_TOKEN_PREFIX}${token}`);
    
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data);
    return {
      userId: parsed.userId,
      expiresAt: new Date(parsed.expiresAt),
    };
  }

  async delete(token: string): Promise<void> {
    const data = await this.findByToken(token);
    
    if (data) {
      await this.cacheManager.del(`${REFRESH_TOKEN_PREFIX}${token}`);
      
      const userTokensKey = `${USER_TOKENS_PREFIX}${data.userId}`;
      const existingTokens = await this.cacheManager.get<string>(userTokensKey);
      
      if (existingTokens) {
        const tokens: string[] = JSON.parse(existingTokens);
        const filteredTokens = tokens.filter(t => t !== token);
        await this.cacheManager.set(userTokensKey, JSON.stringify(filteredTokens), SEVEN_DAYS_IN_MS);
      }
    }
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const userTokensKey = `${USER_TOKENS_PREFIX}${userId}`;
    const existingTokens = await this.cacheManager.get<string>(userTokensKey);
    
    if (existingTokens) {
      const tokens: string[] = JSON.parse(existingTokens);
      
      await Promise.all(
        tokens.map(token => this.cacheManager.del(`${REFRESH_TOKEN_PREFIX}${token}`))
      );
      
      await this.cacheManager.del(userTokensKey);
    }
  }
}
