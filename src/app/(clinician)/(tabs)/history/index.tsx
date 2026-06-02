import { useDeferredValue, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssessmentCard } from "@/components/clinician/history/AssessmentCard";
import { BatchCard } from "@/components/clinician/history/BatchCard";
import { HistorySearchBar } from "@/components/clinician/history/HistorySearchBar";
import { ClinicianShell } from "@/components/ClinicianShell";
import {
  deleteAssessment,
  listAssessmentHistory,
  listBatches,
  type AssessmentHistoryListResponse,
  type AssessmentHistorySummaryResponse,
} from "@/services/assessmentService";
import { useAuthStore } from "@/store/authStore";
import type { Assessment, RiskLevel } from "@/types/assessment";

type HistoryTab = "assessments" | "batches";

const HISTORY_TABS: { key: HistoryTab; label: string }[] = [
  { key: "assessments", label: "Assessments" },
  { key: "batches", label: "Batches" },
];

const PAGE_SIZE = 100;
const VALID_RISK_LEVELS: RiskLevel[] = ["High", "Medium", "Low"];

function mapAssessmentSummaryToCard(item: AssessmentHistorySummaryResponse): Assessment {
  return {
    id: item.id,
    patientId: item.patient_id,
    patientName: item.patient_name,
    sampleDate: new Date(item.created_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }),
    riskLevel: VALID_RISK_LEVELS.includes(item.risk_level as RiskLevel)
      ? (item.risk_level as RiskLevel)
      : "Medium",
    riskScore: item.risk_score ?? 0,
    confidence: item.confidence_percent ?? 0,
  };
}

function isRiskLevelSearch(value: string): value is RiskLevel {
  return VALID_RISK_LEVELS.some((riskLevel) => riskLevel.toLowerCase() === value.toLowerCase());
}

export default function History() {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const token = session?.access_token;

  const [activeTab, setActiveTab] = useState<HistoryTab>("assessments");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());

  const assessmentFilters = useMemo(() => {
    if (!deferredSearch) {
      return {
        patientId: undefined as string | undefined,
        patientName: undefined as string | undefined,
        riskLevel: undefined as RiskLevel | undefined,
      };
    }

    if (/^P-/i.test(deferredSearch)) {
      return {
        patientId: deferredSearch,
        patientName: undefined,
        riskLevel: undefined,
      };
    }

    if (isRiskLevelSearch(deferredSearch)) {
      const normalisedRiskLevel =
        deferredSearch[0].toUpperCase() + deferredSearch.slice(1).toLowerCase();

      return {
        patientId: undefined,
        patientName: undefined,
        riskLevel: normalisedRiskLevel as RiskLevel,
      };
    }

    return {
      patientId: undefined,
      patientName: deferredSearch,
      riskLevel: undefined,
    };
  }, [deferredSearch]);

  const assessmentQueryKey = useMemo(
    () => [
      "history",
      "assessments",
      assessmentFilters.patientId ?? "",
      assessmentFilters.patientName ?? "",
      assessmentFilters.riskLevel ?? "",
    ] as const,
    [assessmentFilters.patientId, assessmentFilters.patientName, assessmentFilters.riskLevel]
  );

  const {
    data: assessmentHistory,
    isLoading: isAssessmentHistoryLoading,
    isRefetching: isAssessmentHistoryRefetching,
    isError: isAssessmentHistoryError,
    error: assessmentHistoryError,
    refetch: refetchAssessmentHistory,
  } = useQuery<AssessmentHistoryListResponse>({
    queryKey: assessmentQueryKey,
    queryFn: async () => {
      if (!token) throw new Error("You must be logged in to view history.");
      return await listAssessmentHistory(token, {
        patientId: assessmentFilters.patientId,
        patientName: assessmentFilters.patientName,
        riskLevel: assessmentFilters.riskLevel,
        page: 1,
        pageSize: PAGE_SIZE,
      });
    },
    enabled: activeTab === "assessments" && !!token,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
  });

  const {
    data: batchHistory,
    isLoading: isBatchHistoryLoading,
    isRefetching: isBatchHistoryRefetching,
    isError: isBatchHistoryError,
    error: batchHistoryError,
    refetch: refetchBatchHistory,
  } = useQuery({
    queryKey: ["history", "batches"],
    queryFn: async () => {
      if (!token) throw new Error("You must be logged in to view history.");
      return await listBatches(token);
    },
    enabled: activeTab === "batches" && !!token,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ assessmentId, batchId }: { assessmentId: string; batchId: string | null }) => {
      if (!token) throw new Error("You must be logged in to delete an assessment.");
      return { assessmentId, batchId, response: await deleteAssessment(assessmentId, token) };
    },
    onMutate: async ({ assessmentId, batchId }) => {
      await queryClient.cancelQueries({ queryKey: assessmentQueryKey });

      const previousHistory = queryClient.getQueryData<AssessmentHistoryListResponse>(assessmentQueryKey);

      queryClient.setQueryData<AssessmentHistoryListResponse>(assessmentQueryKey, (currentHistory) => {
        if (!currentHistory) return currentHistory;

        return {
          ...currentHistory,
          total: Math.max(0, currentHistory.total - 1),
          results: currentHistory.results.filter((item) => item.id !== assessmentId),
        };
      });

      return { previousHistory, assessmentId, batchId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(assessmentQueryKey, context.previousHistory);
      }
    },
    onSettled: (_data, _error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["history", "assessments"] });
      queryClient.invalidateQueries({ queryKey: ["history", "batch-results"] });

      const batchId = variables?.batchId ?? context?.batchId;
      if (batchId) {
        queryClient.invalidateQueries({ queryKey: ["history", "batch-results", batchId] });
      }

      const assessmentId = variables?.assessmentId ?? context?.assessmentId;
      if (assessmentId) {
        queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      }
    },
  });

  const assessmentBatchMap = useMemo(
    () => new Map(
      assessmentHistory?.results.map((item) => [item.id, item.batch_id ?? null]) ?? []
    ),
    [assessmentHistory]
  );

  const assessments = useMemo(
    () => assessmentHistory?.results.map(mapAssessmentSummaryToCard) ?? [],
    [assessmentHistory]
  );

  const batches = useMemo(() => {
    const allBatches = batchHistory?.results ?? [];
    if (!deferredSearch) return allBatches;

    const searchValue = deferredSearch.toLowerCase();
    return allBatches.filter((item) =>
      item.filename.toLowerCase().includes(searchValue) ||
      item.id.toLowerCase().includes(searchValue) ||
      item.id.slice(-8).toLowerCase().includes(searchValue)
    );
  }, [batchHistory, deferredSearch]);

  const handleAssessmentDelete = (assessmentId: string) => {
    deleteMutation.mutate({
      assessmentId,
      batchId: assessmentBatchMap.get(assessmentId) ?? null,
    });
  };

  const handleAssessmentExpand = (assessmentId: string) => {
    router.push({
      pathname: "/(clinician)/report/[id]",
      params: { id: assessmentId },
    });
  };

  const handleBatchPress = (batchId: string) => {
    router.push({
      pathname: "/(clinician)/batch-results",
      params: { batchId },
    });
  };

  const handleRefresh = () => {
    if (activeTab === "assessments") {
      void refetchAssessmentHistory();
      return;
    }

    void refetchBatchHistory();
  };

  const isLoading = activeTab === "assessments" ? isAssessmentHistoryLoading : isBatchHistoryLoading;
  const isError = activeTab === "assessments" ? isAssessmentHistoryError : isBatchHistoryError;
  const errorMessage = activeTab === "assessments"
    ? (assessmentHistoryError as Error | null)?.message
    : (batchHistoryError as Error | null)?.message;

  const isRefreshing = activeTab === "assessments"
    ? isAssessmentHistoryRefetching
    : isBatchHistoryRefetching;

  return (
    <ClinicianShell scrollable={false}>
      <View className="flex-1 pt-2">
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: "#F1F5F9",
            borderRadius: 12,
            padding: 4,
            alignSelf: "flex-start",
            gap: 4,
          }}
        >
          {HISTORY_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: activeTab === tab.key ? "#FFFFFF" : "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: activeTab === tab.key ? "#111827" : "#9CA3AF",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <HistorySearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={activeTab === "assessments" ? "Search by patient ID, name, or risk" : "Search batch uploads"}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-400 text-sm mt-4">Loading history...</Text>
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-gray-500 text-sm text-center">
              {errorMessage || "History could not be loaded."}
            </Text>
          </View>
        ) : activeTab === "assessments" ? (
          <FlatList
            data={assessments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AssessmentCard
                item={item}
                onDelete={() => handleAssessmentDelete(item.id)}
                onExpand={() => handleAssessmentExpand(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <View className="py-12 items-center">
                <Text className="text-gray-400">No assessments found.</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={batches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BatchCard item={item} onPress={() => handleBatchPress(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <View className="py-12 items-center">
                <Text className="text-gray-400">No batch uploads found.</Text>
              </View>
            }
          />
        )}
      </View>
    </ClinicianShell>
  );
}
