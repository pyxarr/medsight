import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ClinicianShell } from "@/components/ClinicianShell";
import { ConfidenceByDataset } from "@/components/report/ConfidenceByDataset";
import { CrossDatasetAgreement } from "@/components/report/CrossDatasetAgreement";
import { FeatureContributionChart } from "@/components/report/FeatureContributionChart";
import { KeyContributingFactors } from "@/components/report/KeyContributingFactors";
import { OodWarningCard } from "@/components/report/OodWarningCard";
import { ReportDisclaimer } from "@/components/report/ReportDisclaimer";
import { RiskSummaryCard } from "@/components/report/RiskSummaryCard";
import { SuggestedAction } from "@/components/report/SuggestedAction";
import { getAssessment, type AssessmentDetailResponse } from "@/services/assessmentService";
import { useAuthStore } from "@/store/authStore";
import type { RiskLevel } from "@/types/assessment";
import type { ReportData } from "@/types/report";

/**
 * Translates raw API assessment results into a format used by the UI components.
 * Handles formatting of IDs (e.g., A-XXXX), dates, and normalizing risk levels.
 */
function mapApiResultToReportData(apiResult: any, patientId: string, patientName?: string): ReportData {
  // If the result is already a ReportData object, return it directly.
  if (apiResult && 'assessmentId' in apiResult && 'patientId' in apiResult) {
    return {
      ...apiResult,
      patientName: apiResult.patientName ?? apiResult.patient_name ?? patientName ?? "Unknown patient",
    } as ReportData;
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
      patientName: apiResult?.patient_name ?? patientName ?? "Unknown patient",
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
  const { id, data, patientName } = useLocalSearchParams<{ id?: string; data?: string; patientName?: string }>();
  const { session } = useAuthStore();
  const initialReport = data ? mapApiResultToReportData(JSON.parse(data), id ?? "", patientName) : undefined;

  const { 
    data: report, 
    isLoading, 
    isError, 
  } = useQuery<AssessmentDetailResponse, Error, ReportData>({
    queryKey: ['assessment', id],
    queryFn: async () => {
      if (!id) throw new Error("No assessment ID provided");
      if (!session) throw new Error("Authentication required");
      return await getAssessment(id, session.access_token);
    },
    select: (data) => mapApiResultToReportData(data, id ?? "", patientName),
    enabled: !!id && !!session,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const visibleReport = report ?? initialReport;

  if (isLoading && !visibleReport) {
    return (
      <ClinicianShell>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-400 text-sm mt-4">Loading assessment...</Text>
        </View>
      </ClinicianShell>
    );
  }

  if (isError || !visibleReport) {
    return (
      <ClinicianShell>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-sm">
            Assessment could not be loaded. Please try again.
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
        <Text className="text-lg font-bold text-gray-900">{visibleReport.patientName}</Text>
        <Text className="text-sm text-gray-500 mt-0.5">{visibleReport.patientId}</Text>
        <Text className="text-sm text-gray-400 mt-0.5">
          Assessment #{visibleReport.assessmentId} · {visibleReport.sampleDate}
        </Text>
      </View>

      {/* Sections */}
      <View className="gap-6 pb-6">
        {visibleReport.oodWarning?.hasWarning && (
          <OodWarningCard
            flaggedFeatures={visibleReport.oodWarning.flaggedFeatures}
            severity={visibleReport.oodWarning.severity!}
          />
        )}
        <RiskSummaryCard report={visibleReport} />
        <CrossDatasetAgreement level={visibleReport.agreementLevel} />
        <KeyContributingFactors drivers={visibleReport.riskDrivers} />
        <FeatureContributionChart drivers={visibleReport.riskDrivers} />
        <ConfidenceByDataset scores={visibleReport.individualScores ?? {}} riskScore={visibleReport.riskScore} />
        <SuggestedAction action={visibleReport.suggestedAction} riskLevel={visibleReport.riskLevel} agreementLevel={visibleReport.agreementLevel} modelsUsed={visibleReport.modelsUsed ?? 1} />
        <ReportDisclaimer />
      </View>
    </ClinicianShell>
  );
}
