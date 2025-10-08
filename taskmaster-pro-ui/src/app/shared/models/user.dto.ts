export interface PagedDataTableResponse<T> {
  data: T[];
  draw: number;
  recordsTotal: number;
}

export interface UserDto {
  id: string;
  userName?: string;
  email: string;
  emailConfirmed?: boolean;
  fullName?: string;
  roles?: string[];
  displayName: string;
}