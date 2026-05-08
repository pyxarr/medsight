import { z } from "zod";

/**
 * Validation schema for the clinician sign-up screen.
 * Requires first name, last name, and a valid email address.
 */
export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

/**
 * Validation schema for setting the account password.
 * Password must be at least 8 characters and match the confirmation field.
 */
export const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/**
 * Validation schema for the clinician sign-in screen.
 * Requires a valid email and a non-empty password.
 */
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Validation schema for the forgot password request.
 * Requires a valid email address.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

/**
 * Validation schema for updating the password after a reset request.
 * Password must be at least 8 characters and match the confirmation field.
 */
export const newPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type inferences from schemas
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type PasswordSchemaType = z.infer<typeof passwordSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordSchemaType = z.infer<typeof newPasswordSchema>;
