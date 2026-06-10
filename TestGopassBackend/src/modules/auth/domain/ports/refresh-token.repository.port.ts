export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenData {
  userId: string;
  expiresAt: Date;
}

export interface RefreshTokenRepositoryPort {
  save(token: string, userId: string, expiresAt: Date): Promise<void>;
  findByToken(token: string): Promise<RefreshTokenData | null>;
  delete(token: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}
