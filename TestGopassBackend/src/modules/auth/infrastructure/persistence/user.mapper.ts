import { User } from '../../domain/models/user.model';
import { UserOrmEntity } from './user.orm-entity';
import { Email } from '../../domain/value-objects/email.vo';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return User.reconstitute({
      id: entity.id,
      email: Email.create(entity.email),
      password: entity.password,
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(user: User): Partial<UserOrmEntity> {
    return {
      id: user.id,
      email: user.emailValue,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
    };
  }

  static toResponse(user: User): {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } {
    return {
      id: user.id!,
      email: user.emailValue,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
