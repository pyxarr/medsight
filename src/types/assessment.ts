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