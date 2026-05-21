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

export const MOCK_REPORTS: ReportData[] = [
  {
    id: "1",
    patientId: "P-2026-9032",
    assessmentId: "S004",
    sampleDate: "21/3/2026",
    riskLevel: "High",
    riskScore: 0.91,
    confidence: 88,
    agreementLevel: "High",
    riskDrivers: [
      { rank: 1, featureName: "Worst parameter",  contribution: 35, direction: "increases_risk" },
      { rank: 2, featureName: "Concave points",   contribution: 28, direction: "increases_risk" },
      { rank: 3, featureName: "Mean Compactness", contribution: 16, direction: "increases_risk" },
    ],
    suggestedAction: "Priority follow-up recommended",
    individualScores: { wisconsin: 0.91, ucth: 0.86, coimbra: 0.62 },
    oodWarning: { hasWarning: false, flaggedFeatures: [], severity: null },
    modelsUsed: 3,
  },
  {
    id: "2",
    patientId: "P-2026-9031",
    assessmentId: "S003",
    sampleDate: "21/3/2026",
    riskLevel: "Low",
    riskScore: 0.12,
    confidence: 88,
    agreementLevel: "High",
    riskDrivers: [
      { rank: 1, featureName: "Mean Radius",    contribution: -22, direction: "decreases_risk" },
      { rank: 2, featureName: "Texture SE",     contribution: -15, direction: "decreases_risk" },
      { rank: 3, featureName: "Smoothness",     contribution: -10, direction: "decreases_risk" },
    ],
    suggestedAction: "Routine screening schedule. No immediate concerns identified.",
    individualScores: { wisconsin: 0.05, ucth: 0.08, coimbra: 0.12 },
    oodWarning: { hasWarning: false, flaggedFeatures: [], severity: null },
    modelsUsed: 3,
  },
  {
    id: "3",
    patientId: "P-2026-9030",
    assessmentId: "S002",
    sampleDate: "20/3/2026",
    riskLevel: "High",
    riskScore: 0.91,
    confidence: 88,
    agreementLevel: "Mixed",
    riskDrivers: [
      { rank: 1, featureName: "Worst parameter",  contribution: 35, direction: "increases_risk" },
      { rank: 2, featureName: "Concave points",   contribution: 28, direction: "increases_risk" },
      { rank: 3, featureName: "Mean Compactness", contribution: 16, direction: "increases_risk" },
    ],
    suggestedAction: "Follow-up recommended. Mixed model agreement — clinical correlation important.",
    individualScores: { wisconsin: 0.91, ucth: 0.86, coimbra: 0.62 },
    oodWarning: { hasWarning: true, flaggedFeatures: ["Tumor Size", "Invasive Nodes"], severity: "Minor" },
    modelsUsed: 3,
  },
  {
    id: "4",
    patientId: "P-2026-9029",
    assessmentId: "S001",
    sampleDate: "19/3/2026",
    riskLevel: "Medium",
    riskScore: 0.54,
    confidence: 72,
    agreementLevel: "Mixed",
    riskDrivers: [
      { rank: 1, featureName: "Tumor Size",     contribution: 18, direction: "increases_risk" },
      { rank: 2, featureName: "Invasive Nodes", contribution: 12, direction: "increases_risk" },
      { rank: 3, featureName: "Age",            contribution: -8, direction: "decreases_risk" },
    ],
    suggestedAction: "Follow-up imaging within 3-6 months recommended.",
    individualScores: { wisconsin: 0.54, ucth: 0.61, coimbra: 0.42 },
    oodWarning: { hasWarning: true, flaggedFeatures: ["Radius SE", "Compactness"], severity: "Major" },
    modelsUsed: 2,
  },
  {
    id: "5",
    patientId: "P-2026-9028",
    assessmentId: "S000",
    sampleDate: "18/3/2026",
    riskLevel: "Low",
    riskScore: 0.08,
    confidence: 91,
    agreementLevel: "High",
    riskDrivers: [
      { rank: 1, featureName: "Mean Radius",  contribution: -28, direction: "decreases_risk" },
      { rank: 2, featureName: "Smoothness",   contribution: -18, direction: "decreases_risk" },
      { rank: 3, featureName: "Texture SE",   contribution: -12, direction: "decreases_risk" },
    ],
    suggestedAction: "Routine screening schedule. No immediate concerns identified.",
    individualScores: { wisconsin: 0.05, ucth: 0.08, coimbra: 0.12 },
    oodWarning: { hasWarning: false, flaggedFeatures: [], severity: null },
    modelsUsed: 1,
  },
];