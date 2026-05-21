import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OodWarningCardProps {
  flaggedFeatures: string[];
  severity: "Minor" | "Major";
}

export function OodWarningCard({ flaggedFeatures, severity }: OodWarningCardProps) {
  const deviationText =
    severity === "Major"
      ? "Some input features fall outside the model's training distribution (Significant deviation)."
      : "Some input features fall outside the model's training distribution (Moderate deviation).";

  return (
    <View
      className="mx-5 rounded-2xl p-4"
      style={{ backgroundColor: "#FFFBEB", borderColor: "#FED7AA", borderWidth: 1 }}
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2 flex-1">
          <Ionicons name="warning-outline" size={18} color="#D97706" />
          <Text className="text-sm font-bold text-gray-900">Out-of-Distribution Warning</Text>
        </View>
        <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
      </View>

      {/* Description */}
      <Text className="text-xs text-gray-600 mb-2">{deviationText}</Text>

      {/* Affected features */}
      <View className="flex-row items-center gap-1 mb-2">
        <Text className="text-xs font-semibold" style={{ color: "#D97706" }}>
          Affected:{" "}
        </Text>
        <Text className="text-xs text-gray-700">{flaggedFeatures.join(", ")}</Text>
      </View>

      {/* Footer */}
      <Text className="text-xs text-gray-400 italic">
        Clinical correlation is especially important for this assessment.
      </Text>
    </View>
  );
}
