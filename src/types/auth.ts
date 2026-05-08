/**
 * TypeScript types for clinician authentication form data.
 */

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface OtpFormData {
  token: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}
