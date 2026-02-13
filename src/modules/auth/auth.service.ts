import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthUser, SafeUser } from 'src/types/auth-user';
import { UsersService } from 'src/modules/users/users.service';
import bcrypt from 'bcrypt';

interface TokenPayload {
  sub: string;
  email: string;
  name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(user: AuthUser) {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const token = this.jwtService.sign(payload);

    return { token };
  }

  async validateUser(email: string, password: string): Promise<SafeUser> {
    let user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const { password: _, ...safeUser } = user;

    return safeUser;
  }
}
