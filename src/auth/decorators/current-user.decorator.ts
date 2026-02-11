import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../models/userPayload';
import { AuthRequest } from '../models/authRequest';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
