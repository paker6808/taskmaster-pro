export interface VerifySecurityAnswerDto {
  email: string;
  securityAnswer: string;
  recaptchaToken: string;
  sessionToken: string; 
}
