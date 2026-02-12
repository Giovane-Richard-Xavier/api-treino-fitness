import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExerciseDto: CreateExerciseDto) {
    const exercise = await this.prisma.exercises.create({
      data: createExerciseDto,
    });

    return exercise;
  }

  async getAllExercises(
    page: number,
    limit: number,
    sort: 'asc' | 'desc' = 'desc',
  ) {
    const currentPage = Math.max(page, 1);
    const currentLimit = Math.max(limit, 1);
    const skip = (currentPage - 1) * currentLimit;

    const [total, exercises] = await this.prisma.$transaction([
      this.prisma.exercises.count(),
      this.prisma.exercises.findMany({
        skip,
        take: currentLimit,
        orderBy: { createdAt: sort },
      }),
    ]);

    return {
      data: exercises,
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

  async getExerciseById(id: string) {
    const exercise = await this.prisma.exercises.findUnique({ where: { id } });

    if (!exercise) {
      throw new NotFoundException(`Not found Exercise with ID: ${id}`);
    }

    return exercise;
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    const exercise = await this.prisma.exercises.findUnique({ where: { id } });

    if (!exercise) {
      throw new NotFoundException(`Not found Exercise with ID: ${id}`);
    }

    const exerciseUpdated = await this.prisma.exercises.update({
      where: { id },
      data: updateExerciseDto,
    });

    return exerciseUpdated;
  }

  async remove(id: string) {
    const exercise = await this.prisma.exercises.findUnique({ where: { id } });

    if (!exercise) {
      throw new NotFoundException(`Not found Exercise with ID: ${id}`);
    }

    await this.prisma.exercises.delete({ where: { id } });

    return { message: 'Exercise removed successfully!' };
  }
}
