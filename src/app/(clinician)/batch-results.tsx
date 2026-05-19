import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BatchResultRowCard } from "@/components/clinician/BatchResultRowCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import type { BatchAssessmentResponse, BatchResultRow } from "@/types/assessment";

type FilterType = "all" | "failed" | "success" | "high_risk";

export default function BatchResultsScreen() {
  const searchParams = useLocalSearchParams();
  const dataParam = searchParams.data as string | undefined;

  let parsedData: BatchAssessmentResponse | null = null;
  if (dataParam) {
    try {
      parsedData = JSON.parse(dataParam) as BatchAssessmentResponse;
    } catch {
      parsedData = null;
    }
  }

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  if (!parsedData) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">No batch data available.</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-600 px-6 py-3 rounded-md"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { batch_id, summary, results } = parsedData;
  const lastFourOfBatchId = batch_id.slice(-4).toUpperCase();
  const processedDate = new Date().toLocaleDateString("en-GB", {
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
        id: item.patient_id,
        data: JSON.stringify(item.result),
      },
    });
  };

  return (
    <ClinicianShell>
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
