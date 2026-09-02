import * as WebBrowser from "expo-web-browser";
import { supabase } from "./supabase";
import type { AuthError, AuthResponse, Session } from "@supabase/supabase-js";

/**
 * Types for authentication request payloads.
 */
export interface SignUpClinicianRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignUpMemberRequest {
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

export type AuthRole = "member" | "clinician";

export interface GoogleOAuthResult {
  session: Session;
  needsClinicianAcknowledgement: boolean;
}

const GOOGLE_REDIRECT_URL = "medsight://auth/callback";

function splitName(fullName?: string | null): { firstName?: string; lastName?: string } {
  if (!fullName) return {};

  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

export async function signInWithGoogle({ role }: { role: AuthRole }): Promise<GoogleOAuthResult> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: GOOGLE_REDIRECT_URL,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("Unable to start Google sign-in.");

  const result = await WebBrowser.openAuthSessionAsync(data.url, GOOGLE_REDIRECT_URL);

  if (result.type !== "success") {
    throw new Error("Google sign-in was cancelled.");
  }

  const redirectedUrl = new URL(result.url);
  const code = redirectedUrl.searchParams.get("code");

  if (!code) {
    throw new Error("Missing OAuth code.");
  }

  const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) throw exchangeError;

  const session = exchangeData.session;
  if (!session) throw new Error("No session returned from Google sign-in.");

  const currentRole = session.user.user_metadata?.role as AuthRole | undefined;
  const currentAcknowledged = session.user.user_metadata?.acknowledged as boolean | undefined;

  if (currentRole && currentRole !== role) {
    await supabase.auth.signOut();
    throw new Error(`Please use your ${currentRole} account to continue.`);
  }

  if (!currentRole) {
    const nameParts = splitName(
      (session.user.user_metadata?.full_name as string | undefined) ??
        (session.user.user_metadata?.name as string | undefined)
    );

    const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
      data: {
        role,
        acknowledged: role === "clinician" ? false : true,
        first_name: session.user.user_metadata?.first_name ?? nameParts.firstName,
        last_name: session.user.user_metadata?.last_name ?? nameParts.lastName,
      },
    });

    if (updateError) throw updateError;

    return {
      session: updatedUser.user ? { ...session, user: updatedUser.user } : session,
      needsClinicianAcknowledgement: role === "clinician",
    };
  }

  return {
    session,
    needsClinicianAcknowledgement: role === "clinician" && currentAcknowledged !== true,
  };
}

async function signUpWithRole({
  email,
  password,
  firstName,
  lastName,
  role,
}: SignUpClinicianRequest & { role: "clinician" | "member" }): Promise<{ data: any; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        first_name: firstName,
        last_name: lastName,
        acknowledged: false,
      },
    },
  });

  return { data, error };
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
  return await signUpWithRole({
    email,
    password,
    firstName,
    lastName,
    role: "clinician",
  });
}

/**
 * Sign up a new member account with member identity metadata.
 */
export async function signUpMember({
  email,
  password,
  firstName,
  lastName,
}: SignUpMemberRequest): Promise<{ data: any; error: AuthError | null }> {
  return await signUpWithRole({
    email,
    password,
    firstName,
    lastName,
    role: "member",
  });
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
