import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkoutStatus } from '@prisma/client';
import { addExerciseToWorkoutDto } from './dto/add-exercise-workout.dto';

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

  async addExercise(workoutId: string, dto: addExerciseToWorkoutDto) {
    return this.prisma.workoutExercise.create({
      data: {
        ...dto,
        workoutId,
      },
      include: { exercise: true },
    });
  }

  async completExercise(id: string, comment?: string) {
    const updated = await this.prisma.workoutExercise.update({
      where: { id },
      data: { completed: true, comment },
    });

    const remaning = await this.prisma.workoutExercise.count({
      where: { workoutId: updated.workoutId, completed: false },
    });

    if (remaning === 0) {
      await this.prisma.workouts.update({
        where: { id: updated.workoutId },
        data: { status: 'COMPLETE' },
      });
    }

    return updated;
  }

  async getAllWorkout(
    page: number,
    limit: number,
    sort: 'asc' | 'desc' = 'desc',
  ) {
    const currentPage = Math.max(page, 1);
    const currentLimit = Math.max(limit, 1);
    const skip = (currentPage - 1) * currentLimit;

    const [total, workouts] = await this.prisma.$transaction([
      this.prisma.workouts.count(),
      this.prisma.workouts.findMany({
        skip,
        take: currentLimit,
        orderBy: { createdAt: sort },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    return {
      data: workouts,
      meta: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPage: Math.ceil(total / currentLimit),
        hasNextPage: currentPage < Math.ceil(total / currentLimit),
        hasPrevPage: currentPage,
        sort,
      },
    };
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
