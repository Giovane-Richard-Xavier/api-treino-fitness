import { WorkoutStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkoutDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @IsEnum(WorkoutStatus, { message: 'Status inválido' })
  status: WorkoutStatus;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
