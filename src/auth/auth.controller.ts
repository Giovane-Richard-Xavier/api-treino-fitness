import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import type { Response } from 'express';
import { AuthUser } from 'src/types/auth-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req: { user: any },
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawUser = req.user;

    const authUser: AuthUser = {
      ...rawUser,
      password: undefined,
    };

    const { token } = await this.authService.login(authUser);

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
    });

    return { success: true };
  }
}
