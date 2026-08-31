import { fetchApi } from "@/lib/api";

/**
 * Error carrying an HTTP status code so callers can branch on
 * specific failures (e.g. 413 file too large, 500 upload failed).
 */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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

/**
 * Professional detail fields that a user may update on their own profile.
 * Role and verification fields are not editable via this endpoint.
 */
export interface ProfileUpdateRequest {
  display_name?: string;
  username?: string;
  location?: string;
  // Clinician-only (backend ignores for members):
  institution?: string;
  specialisation?: string;
  experience_years?: number;
}

/**
 * Update the current user's professional detail fields via PATCH /api/users/me.
 * Only the fields provided in the request are updated.
 */
export async function updateProfile(
  fields: ProfileUpdateRequest,
  token: string
): Promise<UserProfile> {
  const body: Record<string, unknown> = {};
  if (fields.display_name !== undefined) body.display_name = fields.display_name;
  if (fields.username !== undefined) body.username = fields.username;
  if (fields.location !== undefined) body.location = fields.location;
  if (fields.institution !== undefined) body.institution = fields.institution;
  if (fields.specialisation !== undefined) body.specialisation = fields.specialisation;
  if (fields.experience_years !== undefined) body.experience_years = fields.experience_years;

  return await fetchApi<UserProfile>("/api/users/me", {
    method: "PATCH",
    body,
    token,
  });
}

/**
 * Picked document that can be attached to the verification upload.
 */
export interface VerificationFile {
  uri: string;
  name: string;
  mimeType: string;
}

export interface VerificationSubmitRequest {
  medicalLicenceNumber: string;
  file?: VerificationFile;
}

/**
 * Submit clinician verification details (medical licence number and an
 * optional licence document) to the backend using multipart/form-data.
 *
 * Uses the native XHR/FormData path so picked file URIs upload reliably
 * in SDK 56 (same approach as batch assessment uploads). The `file` field
 * is only appended when a document was picked.
 *
 * Rejects with `ApiError` carrying the HTTP status so the caller can
 * distinguish 413 (file too large), 500 (upload failed) and network errors.
 */
export async function submitVerification(
  request: VerificationSubmitRequest,
  token: string
): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("medical_licence_number", request.medicalLicenceNumber);

  if (request.file) {
    formData.append(
      "file",
      {
        uri: request.file.uri,
        name: request.file.name,
        type: request.file.mimeType,
      } as unknown as Blob
    );
  }

  return await new Promise<UserProfile>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "PATCH",
      `${process.env.EXPO_PUBLIC_API_URL}/api/users/me/verification`
    );
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as UserProfile);
        return;
      }

      reject(
        new ApiError(
          xhr.status,
          xhr.responseText || "Something went wrong. Please try again."
        )
      );
    };

    xhr.onerror = () => {
      reject(new ApiError(0, "Network request failed"));
    };

    xhr.send(formData);
  });
}

/**
 * Picked image that will be attached to the avatar upload.
 */
export interface AvatarFile {
  uri: string;
  name: string;
  mimeType: string;
}

/**
 * Check if a username is available.
 */
export async function checkUsernameAvailability(username: string, token: string): Promise<{ available: boolean }> {
  return fetchApi<{ available: boolean }>(`/api/users/check-username?username=${encodeURIComponent(username)}`, { token });
}

/**
 * Upload a new avatar image for the current user via PATCH /api/users/me/avatar
 * using multipart/form-data. Uses the native XHR/FormData path so picked image
 * URIs upload reliably in SDK 56 (same approach as verification uploads).
 *
 * Rejects with `ApiError` carrying the HTTP status so the caller can
 * distinguish 400 (not an image), 413 (file too large), 500 (upload failed)
 * and network errors.
 */
export async function uploadAvatar(
  file: AvatarFile,
  token: string
): Promise<UserProfile> {
  const formData = new FormData();
  formData.append(
    "file",
    {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as unknown as Blob
  );

  return await new Promise<UserProfile>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PATCH", `${process.env.EXPO_PUBLIC_API_URL}/api/users/me/avatar`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as UserProfile);
        return;
      }

      reject(
        new ApiError(
          xhr.status,
          xhr.responseText || "Something went wrong. Please try again."
        )
      );
    };

    xhr.onerror = () => {
      reject(new ApiError(0, "Network request failed"));
    };

    xhr.send(formData);
  });
}
