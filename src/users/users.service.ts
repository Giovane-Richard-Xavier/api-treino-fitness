import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Usuário já cadastrado com esse e-mail.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: { name: true, email: true, createdAt: true, updatedAt: true },
    });

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
