import type { Assessment } from "./assessment";

export type AgreementLevel = "High" | "Mixed" | "Low" | "Single Model";

export interface RiskDriver {
  rank: number;
  featureName: string;
  contribution: number; // positive = increases risk, negative = decreases
}

export interface ReportData extends Assessment {
  assessmentId: string;
  agreementLevel: AgreementLevel;
  riskDrivers: RiskDriver[];
  suggestedAction: string;
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
      { rank: 1, featureName: "Worst parameter",  contribution: 35 },
      { rank: 2, featureName: "Concave points",   contribution: 28 },
      { rank: 3, featureName: "Mean Compactness", contribution: 16 },
    ],
    suggestedAction: "Priority follow-up recommended",
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
      { rank: 1, featureName: "Mean Radius",    contribution: -22 },
      { rank: 2, featureName: "Texture SE",     contribution: -15 },
      { rank: 3, featureName: "Smoothness",     contribution: -10 },
    ],
    suggestedAction: "Routine screening schedule. No immediate concerns identified.",
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
      { rank: 1, featureName: "Worst parameter",  contribution: 35 },
      { rank: 2, featureName: "Concave points",   contribution: 28 },
      { rank: 3, featureName: "Mean Compactness", contribution: 16 },
    ],
    suggestedAction: "Follow-up recommended. Mixed model agreement — clinical correlation important.",
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
      { rank: 1, featureName: "Tumor Size",     contribution: 18 },
      { rank: 2, featureName: "Invasive Nodes", contribution: 12 },
      { rank: 3, featureName: "Age",            contribution: -8 },
    ],
    suggestedAction: "Follow-up imaging within 3-6 months recommended.",
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
      { rank: 1, featureName: "Mean Radius",  contribution: -28 },
      { rank: 2, featureName: "Smoothness",   contribution: -18 },
      { rank: 3, featureName: "Texture SE",   contribution: -12 },
    ],
    suggestedAction: "Routine screening schedule. No immediate concerns identified.",
  },
];