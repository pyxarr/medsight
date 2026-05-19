import { File, Paths } from "expo-file-system";
import { fetch } from "expo/fetch";
import type { BatchAssessmentResponse } from "@/types/assessment";

/**
 * Submits a CSV or Excel file for batch assessment to the backend.
 * Uses expo-file-system File with expo/fetch FormData — the only combination
 * that correctly handles multipart file uploads in Expo SDK 55.
 * Errors are not caught here and will propagate to the caller.
 */
export async function submitBatchAssessment(
  file: { uri: string; name: string; mimeType: string },
  token: string
): Promise<BatchAssessmentResponse> {
  // Copy the picker file to a named cache path so the multipart upload sends
  // the real filename rather than the DocumentPicker UUID cache path.
  const namedCacheFile = new File(Paths.cache, file.name);
  const sourceFile = new File(file.uri);
  if (namedCacheFile.exists) {
    namedCacheFile.delete();
  }
  sourceFile.copy(namedCacheFile);

  const formData = new FormData();
  formData.append("file", namedCacheFile);

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/clinician/batch-assess`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorBody}`
    );
  }

  return response.json() as Promise<BatchAssessmentResponse>;
}
