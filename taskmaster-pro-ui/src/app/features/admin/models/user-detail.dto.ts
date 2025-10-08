export interface UserDetailDto {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  fullName: string;
  roles: string[];
  securityQuestion?: string | null;
  failedSecurityQuestionAttempts?: number;
  lockoutEndMinutesRemaining?: number;
}