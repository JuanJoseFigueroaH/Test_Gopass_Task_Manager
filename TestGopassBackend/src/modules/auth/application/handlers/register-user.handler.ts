import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterUserCommand } from '../commands/register-user.command';
import { User } from '../../domain/models/user.model';
import { UserRepositoryPort, USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { UserMapper } from '../../infrastructure/persistence/user.mapper';
import { AuthResponseDto } from '../dtos/login.dto';
import { UserRegisteredEvent } from '../../domain/events/user-registered.event';
import { Result } from '../../../../shared/domain/result';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, AuthResponseDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterUserCommand): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(command.email.toLowerCase());

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);

    const userResult = User.create({
      email: command.email,
      password: hashedPassword,
      firstName: command.firstName,
      lastName: command.lastName,
    });

    if (Result.isFail(userResult)) {
      throw new BadRequestException(userResult.error.message);
    }

    const savedUser = await this.userRepository.create(userResult.data);

    this.eventBus.publish(new UserRegisteredEvent(
      savedUser.id!,
      savedUser.emailValue,
      savedUser.firstName,
      savedUser.lastName,
    ));

    return this.generateAuthResponse(savedUser);
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
}
