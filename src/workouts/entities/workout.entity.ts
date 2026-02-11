import { $Enums, Workouts } from '@prisma/client';

export class WorkoutEntity implements Workouts {
  id: string;
  date: Date;
  notes: string | null;
  status: $Enums.WorkoutStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
