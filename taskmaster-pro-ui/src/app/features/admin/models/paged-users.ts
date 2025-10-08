import { UserDto } from '../../../shared/models/user.dto';

export interface PagedUsersViewModel {
  draw: number;
  recordsTotal: number;
  data: UserDto[];
}