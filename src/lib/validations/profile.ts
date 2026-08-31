import { z } from "zod";

/**
 * Base profile fields editable by both members and clinicians.
 */
const baseProfileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .max(100, "Display name must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores")
    .max(30, "Username must be 30 characters or fewer")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(100, "Location must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),
});

/**
 * Validation schema for editing member profile fields.
 * Mirrors the backend PATCH /api/users/me validation rules for members.
 */
export const memberProfileSchema = baseProfileSchema;

export type MemberProfileFormData = z.infer<typeof memberProfileSchema>;

/**
 * Validation schema for editing clinician profile fields.
 * Includes base fields + clinician-specific fields.
 */
export const clinicianProfileSchema = baseProfileSchema.extend({
  institution: z
    .string()
    .trim()
    .max(100, "Institution must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),
  specialisation: z
    .string()
    .trim()
    .max(50, "Specialisation must be 50 characters or fewer")
    .optional()
    .or(z.literal("")),
  experience_years: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || (!Number.isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 50), {
      message: "Experience years must be between 0 and 50",
    }),
});

export type ClinicianProfileFormData = z.infer<typeof clinicianProfileSchema>;