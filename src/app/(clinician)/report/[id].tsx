import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ConfidenceByDataset } from "@/components/clinician/report/ConfidenceByDataset";
import { CrossDatasetAgreement } from "@/components/clinician/report/CrossDatasetAgreement";
import { FeatureContributionChart } from "@/components/clinician/report/FeatureContributionChart";
import { KeyContributingFactors } from "@/components/clinician/report/KeyContributingFactors";
import { OodWarningCard } from "@/components/clinician/report/OodWarningCard";
import { ReportDisclaimer } from "@/components/clinician/report/ReportDisclaimer";
import { RiskSummaryCard } from "@/components/clinician/report/RiskSummaryCard";
import { SuggestedAction } from "@/components/clinician/report/SuggestedAction";
import { ClinicianShell } from "@/components/ClinicianShell";
import { getAssessment } from "@/services/assessmentService";
import { useAuthStore } from "@/store/authStore";
import type { RiskLevel } from "@/types/assessment";
import { MOCK_REPORTS } from "@/types/report";
import type { ReportData } from "@/types/report";

/**
 * Translates raw API assessment results into a format used by the UI components.
 * Handles formatting of IDs (e.g., A-XXXX), dates, and normalizing risk levels.
 */
function mapApiResultToReportData(apiResult: any, patientId: string): ReportData {
  // If the result is already a ReportData object (e.g. from MOCK_REPORTS), return it directly
  if (apiResult && 'assessmentId' in apiResult && 'patientId' in apiResult) {
    return apiResult as ReportData;
  }

  const assessmentId = apiResult?.assessment_id || apiResult?.id
    ? `A-${(apiResult.assessment_id || apiResult.id).slice(-8).toUpperCase()}`
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
      id: apiResult?.assessment_id ?? apiResult?.id ?? "unknown",
      patientId: apiResult?.patient_id ?? patientId,
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
  const { session } = useAuthStore();

  const { 
    data: report, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      if (!id) throw new Error("No assessment ID provided");

      // 1. Check Mocks
      const mock = MOCK_REPORTS.find((r) => r.id === id);
      if (mock) return mock;

      // 2. Fetch from API
      if (!session) throw new Error("Authentication required");
      return await getAssessment(id, session.access_token);
    },
    select: (data) => mapApiResultToReportData(data, id ?? ""),
    initialData: data ? JSON.parse(data) : undefined,
    enabled: !!id && !!session,
  });

  if (isLoading) {
    return (
      <ClinicianShell>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-400 text-sm mt-4">Loading assessment...</Text>
        </View>
      </ClinicianShell>
    );
  }

  if (isError || !report) {
    return (
      <ClinicianShell>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-sm">
            {(error as Error)?.message || "Assessment not found."}
          </Text>
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
