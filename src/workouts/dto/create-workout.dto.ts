import { WorkoutStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkoutDto {
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsNotEmpty()
  notes?: string | null;

  @IsEnum(WorkoutStatus, { message: 'Status inválido' })
  status: WorkoutStatus;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
