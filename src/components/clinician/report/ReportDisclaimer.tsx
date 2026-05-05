import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function ReportDisclaimer() {
  return (
    <View className="mx-5 gap-3">
      {/* Model limitations */}
      <View className="flex-row items-center gap-2">
        <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
        <Text className="text-xs text-gray-400">Model limitations apply</Text>
      </View>

      {/* Disclaimer box */}
      <View className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
        <Text className="text-sm leading-5">
          <Text className="font-bold text-red-600">
            This tool provides clinical decision support only —{" "}
          </Text>
          <Text className="text-gray-600">
            it does not provide diagnosis or replace professional medical judgment...
          </Text>
          <Text className="text-blue-600"> More</Text>
        </Text>
      </View>
    </View>
  );
}