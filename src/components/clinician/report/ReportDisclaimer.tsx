import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function ReportDisclaimer() {
  return (
    <View className="mx-5">
      <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
        {/* Header row */}
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons name="shield-checkmark-outline" size={14} color="#6B7280" />
          <Text className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            Model Limitations
          </Text>
        </View>

        {/* Full disclaimer text */}
        <Text className="text-xs text-gray-500" style={{ lineHeight: 18 }}>
          This tool provides clinical decision support only — it does not replace professional medical judgement. Results should be interpreted alongside clinical findings, patient history, and specialist review. Not validated for use as a standalone diagnostic tool.
        </Text>
      </View>
    </View>
  );
}
