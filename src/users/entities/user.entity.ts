import { Users } from '@prisma/client';

export class UserEntity implements Users {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
