import { WorkoutStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutDto {
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(WorkoutStatus, { message: 'Status inválido' })
  status: WorkoutStatus;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
