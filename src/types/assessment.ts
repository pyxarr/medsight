export type RiskLevel = "High" | "Medium" | "Low";

export interface Assessment {
  id: string;
  patientId: string;
  sampleDate: string;
  riskLevel: RiskLevel;
  riskScore: number;
  confidence: number;
}

export const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; bar: string }> = {
  High:   { bg: "#FEE2E2", text: "#DC2626", bar: "#EF4444" },
  Medium: { bg: "#FEF3C7", text: "#D97706", bar: "#F59E0B" },
  Low:    { bg: "#DCFCE7", text: "#16A34A", bar: "#22C55E" },
};

/**
 * Summary of a batch assessment operation.
 */
export interface BatchSummary {
  total: number;
  success: number;
  failed: number;
}

/**
 * Single row result from a batch assessment.
 */
export interface BatchResultRow {
  row_index: number;
  patient_id: string;
  patient_name: string;
  status: "success" | "failed";
    result?: {
    risk_level: string;
    models_used: number;
    confidence_percent: number;
    risk_score: number;
    agreement: string;
    clinical_guidance: string;
    individual_scores: Record<string, unknown>;
    key_risk_drivers: string[];
    ood_warning: Record<string, unknown>;
    assessment_id: string | null;
    created_at: string | null;
  };
  error?: string;
}

/**
 * Full response from the batch assessment endpoint.
 */
export interface BatchAssessmentResponse {
  batch_id: string;
  summary: BatchSummary;
  results: BatchResultRow[];
}