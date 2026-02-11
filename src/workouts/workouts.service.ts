import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkoutStatus } from '@prisma/client';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    // verifica se o usuário existe
    const userExists = await this.prisma.users.findUnique({
      where: { id: createWorkoutDto.userId },
    });

    if (!userExists) {
      throw new NotFoundException('Not found user');
    }

    // cria o treino
    const workout = await this.prisma.workouts.create({
      data: {
        ...createWorkoutDto,
        status: createWorkoutDto.status ?? WorkoutStatus.PENDING,
      },
    });

    return workout;
  }

  findAll() {
    return `This action returns all workouts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workout`;
  }

  update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    return `This action updates a #${id} workout`;
  }

  remove(id: number) {
    return `This action removes a #${id} workout`;
  }
}
