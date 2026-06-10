import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserCommand } from '../commands/login-user.command';
import { User } from '../../domain/models/user.model';
import { UserRepositoryPort, USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { UserMapper } from '../../infrastructure/persistence/user.mapper';
import { Email } from '../../domain/value-objects/email.vo';
import { AuthResponseDto } from '../dtos/login.dto';
import { UserLoggedInEvent } from '../../domain/events/user-logged-in.event';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand, AuthResponseDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: LoginUserCommand): Promise<AuthResponseDto> {
    let email: Email;
    try {
      email = Email.create(command.email);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userRepository.findByEmail(email.getValue());

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(command.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.eventBus.publish(new UserLoggedInEvent(
      user.id!,
      user.emailValue,
      new Date(),
    ));

    return this.generateAuthResponse(user);
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
