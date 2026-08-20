import { z } from "zod";

/**
 * Validation schema for editing professional detail fields.
 * Mirrors the backend PATCH /api/users/me validation rules:
 * - institution: optional, max 100 chars
 * - specialisation: optional, max 50 chars
 * - experience_years: optional, 0-50
 * - location: optional, max 100 chars
 */
export const professionalDetailsSchema = z.object({
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
  location: z
    .string()
    .trim()
    .max(100, "Location must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export type ProfessionalDetailsFormData = z.infer<typeof professionalDetailsSchema>;