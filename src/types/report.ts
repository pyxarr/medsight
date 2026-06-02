import type { Assessment } from "./assessment";

export type AgreementLevel = "High" | "Mixed" | "Low" | "Single Model";

export interface RiskDriver {
  rank: number;
  featureName: string;
  contribution: number; // signed: positive = increases risk, negative = decreases risk
  direction: "increases_risk" | "decreases_risk";
}

export interface ReportData extends Assessment {
  assessmentId: string;
  agreementLevel: AgreementLevel;
  riskDrivers: RiskDriver[];
  suggestedAction: string;
  individualScores?: Record<string, number>; // e.g. { ucth: 0.86, wisconsin: 0.91, coimbra: 0.62 }
  oodWarning?: {
    hasWarning: boolean;
    flaggedFeatures: string[];
    severity: "Minor" | "Major" | null;
  };
  modelsUsed?: number;
}

export const AGREEMENT_CONFIG: Record<AgreementLevel, { bg: string; text: string; border: string }> = {
  "High":         { bg: "#DCFCE7", text: "#16A34A", border: "#BBF7D0" },
  "Mixed":        { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
  "Low":          { bg: "#FEE2E2", text: "#DC2626", border: "#FECACA" },
  "Single Model": { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
};

