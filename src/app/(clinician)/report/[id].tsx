import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ConfidenceByDataset } from "@/components/clinician/report/ConfidenceByDataset";
import { CrossDatasetAgreement } from "@/components/clinician/report/CrossDatasetAgreement";
import { FeatureContributionChart } from "@/components/clinician/report/FeatureContributionChart";
import { KeyContributingFactors } from "@/components/clinician/report/KeyContributingFactors";
import { OodWarningCard } from "@/components/clinician/report/OodWarningCard";
import { ReportDisclaimer } from "@/components/clinician/report/ReportDisclaimer";
import { RiskSummaryCard } from "@/components/clinician/report/RiskSummaryCard";
import { SuggestedAction } from "@/components/clinician/report/SuggestedAction";
import { ClinicianShell } from "@/components/ClinicianShell";
import type { RiskLevel , BatchResultRow } from "@/types/assessment";
import { MOCK_REPORTS } from "@/types/report";
import type { ReportData } from "@/types/report";

function mapApiResultToReportData(apiResult: BatchResultRow["result"], patientId: string): ReportData {
  const assessmentId = apiResult?.assessment_id
    ? `A-${apiResult.assessment_id.slice(-8).toUpperCase()}`
    : "A-UNKNOWN";

  const sampleDate = apiResult?.created_at
    ? new Date(apiResult.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

  const rawDrivers = apiResult?.key_risk_drivers ?? [];
  const riskDrivers = (rawDrivers as { feature?: string; contribution?: number; direction?: string }[])
    .map((driver, index) => ({
      rank: index + 1,
      featureName: driver.feature ?? "Unknown",
      contribution: Math.round((driver.contribution ?? 0) * 100),
      direction: (driver.direction === "increases_risk" ? "increases_risk" : "decreases_risk") as "increases_risk" | "decreases_risk",
    }));

  const validRiskLevels: RiskLevel[] = ["High", "Medium", "Low"];
  const normalisedRiskLevel = validRiskLevels.includes(
    apiResult?.risk_level as RiskLevel
  )
    ? (apiResult?.risk_level as RiskLevel)
    : "Medium";

  return {
    id: apiResult?.assessment_id ?? "unknown",
    patientId,
    assessmentId,
    sampleDate,
    riskLevel: normalisedRiskLevel,
    riskScore: apiResult?.risk_score ?? 0,
    confidence: apiResult?.confidence_percent ?? 0,
    agreementLevel: (apiResult?.agreement as ReportData["agreementLevel"]) ?? "Single Model",
    riskDrivers,
    suggestedAction: apiResult?.clinical_guidance ?? "No guidance available.",
    individualScores: (apiResult?.individual_scores as Record<string, number>) ?? {},
    oodWarning: {
      hasWarning: apiResult?.ood_warning?.has_warning ?? false,
      flaggedFeatures: (apiResult?.ood_warning?.flagged ?? []).map((f: { feature: string }) =>
        f.feature.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      ),
      severity: apiResult?.ood_warning?.flagged?.length
        ? (apiResult.ood_warning.flagged.some((f: { severity: string }) => f.severity === "Major") ? "Major" : "Minor")
        : null,
    },
    modelsUsed: apiResult?.models_used ?? 1,
  };
}

export default function ReportScreen() {
  const { id, data } = useLocalSearchParams<{ id?: string; data?: string }>();

  let report: ReportData | undefined;

  if (data) {
    try {
      const parsedResult = JSON.parse(data) as BatchResultRow["result"];
      report = mapApiResultToReportData(parsedResult, id ?? "");
    } catch {
      report = undefined;
    }
  } else if (id) {
    report = MOCK_REPORTS.find((r) => r.id === id);
  }

  if (!report) {
    return (
      <ClinicianShell>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-sm">Assessment not found.</Text>
        </View>
      </ClinicianShell>
    );
  }

  return (
    <ClinicianShell>
      {/* Back + Title */}
      <View className="px-5 mb-6">
        <Text className="text-2xl font-bold text-gray-900">Analysis Result</Text>
      </View>

      {/* Patient ID + Assessment */}
      <View className="px-5 mb-6">
        <Text className="text-lg font-bold text-gray-900">{report.patientId}</Text>
        <Text className="text-sm text-gray-400 mt-0.5">
          Assessment #{report.assessmentId} · {report.sampleDate}
        </Text>
      </View>

      {/* Sections */}
      <View className="gap-6 pb-6">
        {report.oodWarning?.hasWarning && (
          <OodWarningCard
            flaggedFeatures={report.oodWarning.flaggedFeatures}
            severity={report.oodWarning.severity!}
          />
        )}
        <RiskSummaryCard report={report} />
        <CrossDatasetAgreement level={report.agreementLevel} />
        <KeyContributingFactors drivers={report.riskDrivers} />
        <FeatureContributionChart drivers={report.riskDrivers} />
        <ConfidenceByDataset scores={report.individualScores ?? {}} riskScore={report.riskScore} />
        <SuggestedAction action={report.suggestedAction} riskLevel={report.riskLevel} agreementLevel={report.agreementLevel} modelsUsed={report.modelsUsed ?? 1} />
        <ReportDisclaimer />
      </View>
    </ClinicianShell>
  );
}
