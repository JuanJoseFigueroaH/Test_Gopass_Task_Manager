import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../domain/models/user.model';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) return null;

    if (data) {
      switch (data) {
        case 'id': return user.id;
        case 'email': return user.emailValue;
        case 'firstName': return user.firstName;
        case 'lastName': return user.lastName;
        case 'role': return user.role;
        default: return null;
      }
    }

    return user;
  },
);
