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

  update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return `This action updates a #${id} exercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} exercise`;
  }
}
