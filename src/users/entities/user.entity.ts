import { Users } from '@prisma/client';

export class UserEntity implements Users {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  password: string;
  updatedAt: Date;
}
