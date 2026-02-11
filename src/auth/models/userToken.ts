import { UserEntity } from 'src/users/entities/user.entity';

export interface UserToken {
  user: UserEntity;
  token: string;
}
