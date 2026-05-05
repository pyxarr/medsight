import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Assessment } from "@/types/assessment";
import { RiskBadge } from "./RiskBadge";
import { RiskScoreBar } from "./RiskScoreBar";

interface AssessmentCardProps {
  item: Assessment;
  onDelete: () => void;
  onExpand: () => void;
}

export function AssessmentCard({ item, onDelete, onExpand }: AssessmentCardProps) {
  return (
    <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-3 mx-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-bold text-[15px] text-gray-900">{item.patientId}</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onDelete}
            activeOpacity={0.7}
            className="w-[34px] h-[34px] rounded-lg border border-gray-200 items-center justify-center"
          >
            <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onExpand}
            activeOpacity={0.7}
            className="w-[34px] h-[34px] rounded-lg border border-gray-200 items-center justify-center"
          >
            <Ionicons name="expand-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-100 mb-4" />

      {/* Rows */}
      <View className="gap-3">
        <View className="flex-row items-center">
          <Text className="text-gray-400 text-sm w-28">Sample Date</Text>
          <Text className="text-gray-400 text-sm mr-3">:</Text>
          <Text className="text-gray-800 text-sm font-medium">{item.sampleDate}</Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-gray-400 text-sm w-28">Risk Level</Text>
          <Text className="text-gray-400 text-sm mr-3">:</Text>
          <RiskBadge level={item.riskLevel} />
        </View>

        <View className="flex-row items-center">
          <Text className="text-gray-400 text-sm w-28">Risk score</Text>
          <Text className="text-gray-400 text-sm mr-3">:</Text>
          <View className="flex-1">
            <RiskScoreBar score={item.riskScore} level={item.riskLevel} />
          </View>
        </View>

        <View className="flex-row items-center">
          <Text className="text-gray-400 text-sm w-28">Confidence</Text>
          <Text className="text-gray-400 text-sm mr-3">:</Text>
          <Text className="text-gray-800 text-sm font-medium">{item.confidence}%</Text>
        </View>
      </View>
    </View>
  );
}