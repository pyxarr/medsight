import { supabase } from "./supabase";
import type { AuthError, AuthResponse } from "@supabase/supabase-js";

/**
 * Types for authentication request payloads.
 */
export interface SignUpClinicianRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  token: string;
}

export interface UpdatePasswordRequest {
  newPassword: string;
}

/**
 * Sign up a new clinician account with professional identity metadata.
 */
export async function signUpClinician({
  email,
  password,
  firstName,
  lastName,
}: SignUpClinicianRequest): Promise<{ data: any; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
      options: {
        data: {
          role: "clinician",
          first_name: firstName,
          last_name: lastName,
          acknowledged: false,
        },
      },
  });

  return { data, error };
}

/**
 * Sign in an existing clinician using email and password.
 */
export async function signInClinician({
  email,
  password,
}: SignInRequest): Promise<AuthResponse> {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign out the current authenticated session.
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  return await supabase.auth.signOut();
}

/**
 * Verify a 6-digit email OTP for account confirmation.
 */
export async function verifyOtp({
  email,
  token,
}: VerifyOtpRequest): Promise<AuthResponse> {
  return await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
}

/**
 * Resend a signup OTP email to the user.
 */
export async function resendOtp({
  email,
}: {
  email: string;
}): Promise<{ data: any; error: AuthError | null }> {
  return await supabase.auth.resend({
    email,
    type: "signup",
  });
}

/**
 * Request a password reset email.
 */
export async function resetPasswordRequest({
  email,
}: {
  email: string;
}): Promise<{ data: any; error: AuthError | null }> {
  return await supabase.auth.resetPasswordForEmail(email);
}

/**
 * Update the password for the currently authenticated user.
 */
export async function updatePassword({
  newPassword,
}: UpdatePasswordRequest): Promise<{ data: any; error: AuthError | null }> {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
}
