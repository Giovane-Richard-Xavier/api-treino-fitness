import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkoutStatus } from '@prisma/client';
import { addExerciseToWorkoutDto } from './dto/add-exercise-workout.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';

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
    const workout = await this.prisma.workouts.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    try {
      return await this.prisma.workoutExercise.create({
        data: {
          ...dto,
          workoutId,
        },
        include: { exercise: true },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'This exercise is already added to this workout',
        );
      }

      throw error;
    }
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

  // Atualizar séries, reps ou peso
  async updateWorkoutExercise(
    id: string,
    updateWorkoutExerciseDto: UpdateWorkoutExerciseDto,
  ) {
    const exercise = await this.prisma.workoutExercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new NotFoundException('WorkoutExercise not found');
    }

    return this.prisma.workoutExercise.update({
      where: { id },
      data: updateWorkoutExerciseDto,
    });
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

  async findOne(id: string) {
    const workout = await this.prisma.workouts.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
        exercises: {
          select: {
            id: true,
            sets: true,
            reps: true,
            weight: true,
            completed: true,
            comment: true,
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException(`Not found Workout with ID: ${id}`);
    }

    return workout;
  }

  update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    return `This action updates a #${id} workout`;
  }

  async remove(id: string) {
    const workout = await this.prisma.workouts.findUnique({ where: { id } });

    if (!workout) {
      throw new NotFoundException(`Not found Workout with ID: ${id}`);
    }

    await this.prisma.workouts.delete({ where: { id } });

    return { message: 'Workout removed successfully!' };
  }
}
