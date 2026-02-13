import { UserEntity } from 'src/modules/users/entities/user.entity';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
};

export type SafeUser = Omit<UserEntity, 'password'>;
