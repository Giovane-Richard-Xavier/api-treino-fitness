import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class addExerciseToWorkoutDto {
  @IsString()
  exerciseId: string;

  @IsInt()
  sets: number;

  @IsInt()
  reps: number;

  @IsOptional()
  @IsNumber()
  weight?: number;
}
