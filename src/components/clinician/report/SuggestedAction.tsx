import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SuggestedActionProps {
  action: string;
}

export function SuggestedAction({ action }: SuggestedActionProps) {
  return (
    <View className="mx-5 border border-red-200 rounded-2xl p-4 bg-red-50">
      {/* Header */}
      <Text className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">
        Suggested Action:
      </Text>

      {/* Action row */}
      <View className="flex-row items-center gap-2 mb-3">
        <Ionicons name="return-down-forward-outline" size={16} color="#374151" />
        <Text className="text-sm font-semibold text-gray-900 flex-1">{action}</Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-red-100 mb-3" />

      {/* Footer */}
      <Text className="text-xs text-gray-400">
        Decision support only — clinical judgement required
      </Text>
    </View>
  );
}