import { UserEntity } from 'src/modules/users/entities/user.entity';

export interface UserToken {
  user: UserEntity;
  token: string;
}
