import type { BatchAssessmentResponse } from "@/types/assessment";

export interface ManualAssessmentRequest {
  first_name: string;
  last_name: string;
  clinical_data: Record<string, any>;
  blood_panel?: Record<string, any>;
}

export interface ManualAssessmentResponse {
  assessment_id: string;
  created_at: string;
  patient_id: string;
  risk_score: number;
  risk_level: string;
  confidence_percent: number;
  agreement: number;
  models_used: string[];
  individual_scores: Record<string, number>;
  clinical_guidance: string;
  key_risk_drivers: any;
  ood_warning: {
    has_warning: boolean;
    flagged: any[];
  };
}

export interface AssessmentDetailResponse {
  id: string;
  patient_id: string;
  patient_name: string;
  risk_score: number;
  risk_level: string;
  confidence_percent: number;
  agreement: number;
  models_used: any;
  individual_scores: Record<string, number>;
  clinical_guidance: string;
  key_risk_drivers: any;
  ood_warning: {
    has_warning: boolean;
    flagged: any[];
  };
  created_at: string;
}

/**
 * Submits a CSV or Excel file for batch assessment to the backend.
 * Uses the native fetch/FormData path so the original filename is preserved
 * and no extra file-system copy step is needed.
 * Errors are not caught here and will propagate to the caller.
 */
export async function submitBatchAssessment(
  file: { uri: string; name: string; mimeType: string },
  token: string
): Promise<BatchAssessmentResponse> {
  // RN's XMLHttpRequest multipart path handles picked file URIs reliably in SDK 56.
  const formData = new FormData();
  formData.append(
    "file",
    {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as any
  );

  const response = await new Promise<BatchAssessmentResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `${process.env.EXPO_PUBLIC_API_URL}/api/clinician/batch-assess`
    );
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as BatchAssessmentResponse);
        return;
      }

      reject(
        new Error(
          `API request failed with status ${xhr.status}: ${xhr.responseText}`
        )
      );
    };

    xhr.onerror = () => {
      reject(new Error("Network request failed"));
    };

    xhr.send(formData);
  });

  return response;
}

/**
 * Submits a manual clinician assessment request.
 */
export async function submitManualAssessment(
  payload: ManualAssessmentRequest,
  token: string
): Promise<ManualAssessmentResponse> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/clinician/manual-assess`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorBody}`
    );
  }

  return response.json() as Promise<ManualAssessmentResponse>;
}

/**
 * Fetches the details of a single assessment by ID.
 */
export async function getAssessment(
  id: string,
  token: string
): Promise<AssessmentDetailResponse> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/clinician/assessments/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorBody}`
    );
  }

  return response.json() as Promise<AssessmentDetailResponse>;
}
