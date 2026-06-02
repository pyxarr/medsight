import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BatchInfoResponse } from "@/services/assessmentService";

interface BatchCardProps {
  item: BatchInfoResponse;
  onPress: () => void;
}

export function BatchCard({ item, onPress }: BatchCardProps) {
  const createdAt = new Date(item.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl border border-gray-100 p-4 mb-3 mx-5"
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-bold text-[15px] text-gray-900" numberOfLines={1}>
            {item.filename}
          </Text>
          <Text className="text-sm text-gray-400 mt-1">
            Batch #{item.id.slice(-8).toUpperCase()}
          </Text>
        </View>
        <View className="w-9 h-9 rounded-lg bg-blue-50 items-center justify-center">
          <Ionicons name="albums-outline" size={18} color="#2563EB" />
        </View>
      </View>

      <View className="h-px bg-gray-100 my-4" />

      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-gray-600">{createdAt}</Text>
        <Text className="text-sm font-semibold text-gray-900">
          {item.total_records} records
        </Text>
      </View>
    </TouchableOpacity>
  );
}
