import { fetchApi } from "@/lib/api";

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  institution: string | null;
  specialisation: string | null;
  experience_years: number | null;
  location: string | null;
  medical_licence_number: string | null;
  licence_document_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch the current authenticated user's profile from the backend.
 */
export async function getCurrentUserProfile(token: string): Promise<UserProfile> {
  return await fetchApi<UserProfile>("/api/users/me", {
    token,
  });
}
