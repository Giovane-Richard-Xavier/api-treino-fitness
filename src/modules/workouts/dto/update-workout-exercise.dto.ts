import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateWorkoutExerciseDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  sets?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  reps?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;
}
