import { View, Text, TouchableOpacity } from "react-native";
import type { BatchResultRow } from "@/types/assessment";

function getRiskLevelColour(riskLevel: string | undefined): string {
  if (!riskLevel) return "#9CA3AF";
  const normalised = riskLevel.toLowerCase();
  if (normalised === "high") return "#DC2626";
  if (normalised === "medium") return "#D97706";
  if (normalised === "low") return "#16A34A";
  return "#9CA3AF";
}

interface BatchResultRowProps {
  row: BatchResultRow;
  onPress: (row: BatchResultRow) => void;
}

export function BatchResultRowCard({ row, onPress }: BatchResultRowProps) {
  const isFailed = row.status === "failed";

  return (
    <TouchableOpacity
      className={`bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm`}
      onPress={() => onPress(row)}
      disabled={isFailed}
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-base font-bold text-gray-900">
          {row.patient_name}
        </Text>
        <View
          className={`px-3 py-1 rounded-full ${
            row.status === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              row.status === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {row.status === "success" ? "Success" : "Failed"}
          </Text>
        </View>
      </View>

      {!isFailed && (
        <>
          <Text className="text-sm text-gray-400 mb-2">{row.patient_id}</Text>

          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-600 mr-4">
              <Text className="text-gray-400">{"\u2022 "}</Text>
              Risk level:{" "}
              <Text
                style={{
                  color: getRiskLevelColour(row.result?.risk_level),
                  fontWeight: "600",
                }}
              >
                {row.result?.risk_level ?? "??"}
              </Text>
            </Text>
            <Text className="text-xs text-gray-600 mr-4">
              <Text className="text-gray-400">{"\u2022 "}</Text>
              Model used:{" "}
              <Text className="font-semibold text-gray-700">
                {row.result?.models_used ?? "??"}
              </Text>
            </Text>
            <Text className="text-xs text-gray-600">
              <Text className="text-gray-400">{"\u2022 "}</Text>
              Confidence:{" "}
              <Text className="font-semibold text-gray-700">
                {`${row.result?.confidence_percent ?? "??"}%`}
              </Text>
            </Text>
          </View>
        </>
      )}

      {isFailed && row.error && (
        <View className="mt-2">
          <Text className="text-xs">
            <Text className="text-red-500 font-medium">Reason: </Text>
            <Text className="text-gray-500">{row.error}</Text>
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
