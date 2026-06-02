import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQueries, useQuery } from "@tanstack/react-query";
import { BatchResultRowCard } from "@/components/clinician/BatchResultRowCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import {
  getAssessment,
  listBatchAssessmentHistory,
  listBatches,
} from "@/services/assessmentService";
import { useAuthStore } from "@/store/authStore";
import type {
  BatchAssessmentResponse,
  BatchResultRow,
} from "@/types/assessment";

type FilterType = "all" | "failed" | "success" | "high_risk";

export default function BatchResultsScreen() {
  const searchParams = useLocalSearchParams();
  const dataParam = searchParams.data as string | undefined;
  const batchIdParam = (searchParams.batchId ?? searchParams.id) as string | undefined;
  const { session } = useAuthStore();
  const token = session?.access_token;

  const parsedData = useMemo<BatchAssessmentResponse | null>(() => {
    if (!dataParam) return null;

    try {
      return JSON.parse(dataParam) as BatchAssessmentResponse;
    } catch {
      return null;
    }
  }, [dataParam]);

  const batchHistoryQuery = useQuery({
    queryKey: ["history", "batch-results", batchIdParam],
    queryFn: async () => {
      if (!batchIdParam) throw new Error("No batch ID provided.");
      if (!token) throw new Error("You must be logged in to view batch results.");

      const [batchesResponse, batchAssessmentsResponse] = await Promise.all([
        listBatches(token),
        listBatchAssessmentHistory(batchIdParam, token),
      ]);

      const batchRecord = batchesResponse.results.find((batch) => batch.id === batchIdParam);

      return { batchRecord, batchAssessmentsResponse };
    },
    enabled: !parsedData && !!batchIdParam && !!token,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  const batchAssessmentQueries = useQueries({
    queries: (batchHistoryQuery.data?.batchAssessmentsResponse.results ?? []).map((summary) => ({
      queryKey: ["assessment", summary.id],
      queryFn: async () => {
        if (!token) throw new Error("You must be logged in to view batch results.");
        return await getAssessment(summary.id, token);
      },
      enabled: !parsedData && !!batchIdParam && !!token,
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24,
    })),
  });

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const historyParsedData = useMemo<BatchAssessmentResponse | null>(() => {
    if (parsedData) return parsedData;
    if (!batchIdParam || !batchHistoryQuery.data) return null;

    const { batchRecord, batchAssessmentsResponse } = batchHistoryQuery.data;
    const results: BatchResultRow[] = batchAssessmentsResponse.results.flatMap((summary, index) => {
      const detailedAssessment = batchAssessmentQueries[index]?.data;
      if (!detailedAssessment) return [];

      return [
        {
          row_index: index + 1,
          patient_id: summary.patient_id,
          patient_name: summary.patient_name,
          status: "success" as const,
          result: {
            id: detailedAssessment.id,
            assessment_id: detailedAssessment.id,
            risk_level: detailedAssessment.risk_level,
            models_used: detailedAssessment.models_used ?? 1,
            confidence_percent: detailedAssessment.confidence_percent,
            risk_score: detailedAssessment.risk_score,
            agreement: String(detailedAssessment.agreement ?? "Single Model"),
            clinical_guidance: detailedAssessment.clinical_guidance,
            individual_scores: detailedAssessment.individual_scores,
            key_risk_drivers: detailedAssessment.key_risk_drivers,
            ood_warning: detailedAssessment.ood_warning,
            created_at: detailedAssessment.created_at,
          },
        } as BatchResultRow,
      ];
    });

    return {
      batch_id: batchIdParam,
      summary: {
        total: batchRecord?.total_records ?? batchAssessmentsResponse.total,
        success: results.length,
        failed: Math.max((batchRecord?.total_records ?? batchAssessmentsResponse.total) - results.length, 0),
      },
      results,
    };
  }, [batchAssessmentQueries, batchHistoryQuery.data, batchIdParam, parsedData]);

  const isHistoryLoading =
    !parsedData && !!batchIdParam && (
      batchHistoryQuery.isLoading || batchAssessmentQueries.some((query) => query.isLoading)
    );

  const isHistoryError = !parsedData && !!batchIdParam && (
    batchHistoryQuery.isError || batchAssessmentQueries.some((query) => query.isError)
  );

  const historyErrorMessage = batchHistoryQuery.error as Error | null;

  const data = parsedData ?? historyParsedData;

  if (!data) {
    return (
      <ClinicianShell>
        <View className="flex-1 items-center justify-center px-10">
          {isHistoryLoading ? (
            <>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text className="text-gray-400 text-sm mt-4">Loading batch...</Text>
            </>
          ) : isHistoryError ? (
            <>
              <Text className="text-gray-500 text-sm text-center">
                {historyErrorMessage?.message || "Batch data could not be loaded."}
              </Text>
              <TouchableOpacity
                className="mt-4 bg-blue-600 px-6 py-3 rounded-md"
                onPress={() => router.back()}
              >
                <Text className="text-white font-semibold">Go back</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="text-gray-500">No batch data available.</Text>
              <TouchableOpacity
                className="mt-4 bg-blue-600 px-6 py-3 rounded-md"
                onPress={() => router.back()}
              >
                <Text className="text-white font-semibold">Go back</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ClinicianShell>
    );
  }

  const { batch_id, summary, results } = data;
  const lastFourOfBatchId = batch_id.slice(-4).toUpperCase();
  const batchRecord = batchHistoryQuery.data?.batchRecord;
  const processedDate = batchRecord
    ? new Date(batchRecord.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const highRiskCount = results.filter(
    (row) => row.status === "success" && row.result?.risk_level === "High"
  ).length;

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "failed", label: "Failed" },
    { key: "success", label: "Success" },
    { key: "high_risk", label: "High risk" },
  ];

  const filteredResults = results.filter((row) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "failed") return row.status === "failed";
    if (activeFilter === "success") return row.status === "success";
    if (activeFilter === "high_risk")
      return row.status === "success" && row.result?.risk_level === "High";
    return true;
  });

  const handleRowPress = (item: BatchResultRow) => {
    if (item.status !== "success" || !item.result) {
      return;
    }
    router.push({
      pathname: "/(clinician)/report/[id]",
      params: {
        id: item.result.assessment_id ?? item.patient_id,
        data: JSON.stringify(item.result),
        patientName: item.patient_name,
      },
    });
  };

  return (
    <ClinicianShell scrollable={true}>
      <View className="flex-1 px-5 mt-3">
        {/* Title and subtitle */}
        <Text className="text-2xl text-gray-900 mb-2">
          Batch results
        </Text>
        <Text className="text-sm text-gray-500 mb-6">
          Processed {processedDate} • Batch #{lastFourOfBatchId}
        </Text>

        {/* Collapsible Batch summary */}
        <TouchableOpacity
          className={`flex-row items-center justify-between py-3 ${
            isSummaryExpanded ? "border-b border-gray-100" : ""
          }`}
          onPress={() => setIsSummaryExpanded((prev) => !prev)}
        >
          <Text className="text-base font-semibold text-gray-900">
            Batch summary
          </Text>
          <Ionicons
            name={isSummaryExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        {isSummaryExpanded && (
          <View className="bg-gray-50 rounded-2xl p-4 mt-5 mb-6">
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Total</Text>
              <Text className="text-sm font-semibold text-gray-900">
                {summary.total}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">High risk</Text>
              <Text className="text-sm font-semibold text-red-600">
                {highRiskCount}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Success</Text>
              <Text className="text-sm font-semibold text-green-600">
                {summary.success}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Failed</Text>
              <Text className="text-sm font-semibold text-red-600">
                {summary.failed}
              </Text>
            </View>
          </View>
        )}

        {/* Filter tabs */}
        <View className="flex-row gap-2 mb-4">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              className={`px-4 py-2 rounded-full border ${
                activeFilter === filter.key
                  ? "border-blue-600"
                  : "border-gray-200"
              }`}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text
                className={`text-sm ${
                  activeFilter === filter.key
                    ? "text-blue-600 font-bold"
                    : "text-gray-600"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Result rows */}
        {filteredResults.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-gray-400">No results match this filter.</Text>
          </View>
        ) : (
          filteredResults.map((row: BatchResultRow) => (
            <BatchResultRowCard key={row.row_index} row={row} onPress={handleRowPress} />
          ))
        )}
      </View>
    </ClinicianShell>
  );
}
