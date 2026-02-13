import { Exercises } from '@prisma/client';

export class ExerciseEntity implements Exercises {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: string;
  createdAt: Date;
  updatedAt: Date;
}
