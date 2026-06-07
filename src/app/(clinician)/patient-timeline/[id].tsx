import { useMemo } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssessmentCard } from "@/components/clinician/history/AssessmentCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import {
  deleteAssessment,
  getPatientHistory,
  type AssessmentHistoryListResponse,
  type AssessmentHistorySummaryResponse,
} from "@/services/assessmentService";
import { useAuthStore } from "@/store/authStore";
import type { Assessment, RiskLevel } from "@/types/assessment";

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

export default function PatientTimeline() {
  const { id: patientId } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const token = session?.access_token;

  const {
    data: patientHistory,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useQuery<AssessmentHistoryListResponse>({
    queryKey: ["patient-timeline", patientId],
    queryFn: async () => {
      if (!token) throw new Error("You must be logged in to view patient history.");
      return await getPatientHistory(patientId, token);
    },
    enabled: !!token && !!patientId,
  });

  const assessmentBatchMap = useMemo(
    () => new Map(
      patientHistory?.results.map((item) => [item.id, item.batch_id ?? null]) ?? [],
    ),
    [patientHistory],
  );

  const assessments: Assessment[] = useMemo(
    () => patientHistory?.results.map(mapAssessmentSummaryToCard) ?? [],
    [patientHistory],
  );

  const deleteMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      if (!token) throw new Error("You must be logged in to delete an assessment.");
      return await deleteAssessment(assessmentId, token);
    },
    onMutate: async (assessmentId) => {
      await queryClient.cancelQueries({ queryKey: ["patient-timeline", patientId] });

      const previousHistory = queryClient.getQueryData<AssessmentHistoryListResponse>(["patient-timeline", patientId]);

      queryClient.setQueryData<AssessmentHistoryListResponse>(["patient-timeline", patientId], (current) => {
        if (!current) return current;
        return {
          ...current,
          total: Math.max(0, current.total - 1),
          results: current.results.filter((item) => item.id !== assessmentId),
        };
      });

      return { previousHistory };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(["patient-timeline", patientId], context.previousHistory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-timeline", patientId] });
      queryClient.invalidateQueries({ queryKey: ["history", "assessments"] });
    },
  });

  const handleAssessmentDelete = (assessmentId: string) => {
    deleteMutation.mutate(assessmentId);
  };

  const handleAssessmentExpand = (assessmentId: string) => {
    router.push({
      pathname: "/(clinician)/report/[id]",
      params: { id: assessmentId },
    });
  };

  const patientName = patientHistory?.results[0]?.patient_name;

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1 pt-2">
        {/* Back button + header */}
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              Patient Timeline
            </Text>
            <Text className="text-xs text-gray-400">
              {patientName ? `${patientName} — ` : ""}{patientId}
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-400 text-sm mt-4">Loading patient history...</Text>
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-10">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="text-center text-gray-500 text-sm mt-4">
              Patient history could not be loaded. Please try again.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-blue-600 px-6 py-3 rounded-full mt-6"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
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
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-20">
                <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-400 text-sm mt-3 text-center px-8">
                  This patient has no assessment history.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ClinicianShell>
  );
}
