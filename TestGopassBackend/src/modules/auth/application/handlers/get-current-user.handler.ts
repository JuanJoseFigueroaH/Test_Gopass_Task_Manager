import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetCurrentUserQuery } from '../queries/get-current-user.query';
import { User } from '../../domain/models/user.model';
import { UserRepositoryPort, USER_REPOSITORY } from '../../domain/ports/user.repository.port';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler implements IQueryHandler<GetCurrentUserQuery, User> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetCurrentUserQuery): Promise<User> {
    const user = await this.userRepository.findById(query.userId);

    if (!user || !user.isActive) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
