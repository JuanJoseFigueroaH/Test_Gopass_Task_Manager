import { Injectable, Inject, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../../domain/models/user.model';
import { UserRepositoryPort, USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { RefreshTokenRepositoryPort, REFRESH_TOKEN_REPOSITORY } from '../../domain/ports/refresh-token.repository.port';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dtos/login.dto';
import { Email } from '../../domain/value-objects/email.vo';
import { UserMapper } from '../../infrastructure/persistence/user.mapper';
import { Result } from '../../../../shared/domain/result';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(registerDto.email.toLowerCase());

    if (existingUser) {
      throw new ConflictException('Este email ya está registrado. Por favor inicie sesión.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const userResult = User.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });

    if (Result.isFail(userResult)) {
      throw new BadRequestException(userResult.error.message);
    }

    const savedUser = await this.userRepository.create(userResult.data);
    return this.generateAuthResponse(savedUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    let email: Email;
    try {
      email = Email.create(loginDto.email);
    } catch {
      throw new UnauthorizedException('Formato de email inválido');
    }

    const user = await this.userRepository.findByEmail(email.getValue());

    if (!user) {
      throw new UnauthorizedException('El usuario no existe. Por favor regístrese primero.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('La cuenta está desactivada. Contacte al administrador.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return this.generateAuthResponse(user);
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    return user?.isActive ? user : null;
  }

  private generateAuthResponse(user: User): AuthResponseDto {
    const payload = {
      sub: user.id,
      email: user.emailValue,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: UserMapper.toResponse(user),
    };
  }

  async generateTokenPair(user: User): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.emailValue,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.save(refreshToken, user.id!, expiresAt);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    const tokenData = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > tokenData.expiresAt) {
      await this.refreshTokenRepository.delete(refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userRepository.findById(tokenData.userId);

    if (!user || !user.isActive) {
      await this.refreshTokenRepository.delete(refreshToken);
      throw new UnauthorizedException('User not found or inactive');
    }

    await this.refreshTokenRepository.delete(refreshToken);

    return this.generateTokenPair(user);
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.delete(refreshToken);
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteAllByUserId(userId);
  }

  async loginWithTokenPair(loginDto: LoginDto): Promise<{ tokens: TokenPair; user: User }> {
    let email: Email;
    try {
      email = Email.create(loginDto.email);
    } catch {
      throw new UnauthorizedException('Formato de email inválido');
    }

    const user = await this.userRepository.findByEmail(email.getValue());

    if (!user) {
      throw new UnauthorizedException('El usuario no existe. Por favor regístrese primero.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('La cuenta está desactivada. Contacte al administrador.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return {
      tokens: await this.generateTokenPair(user),
      user,
    };
  }

  async registerWithTokenPair(registerDto: RegisterDto): Promise<{ tokens: TokenPair; user: User }> {
    const existingUser = await this.userRepository.findByEmail(registerDto.email.toLowerCase());

    if (existingUser) {
      throw new ConflictException('Este email ya está registrado. Por favor inicie sesión.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const userResult = User.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });

    if (Result.isFail(userResult)) {
      throw new BadRequestException(userResult.error.message);
    }

    const savedUser = await this.userRepository.create(userResult.data);

    return {
      tokens: await this.generateTokenPair(savedUser),
      user: savedUser,
    };
  }
}
