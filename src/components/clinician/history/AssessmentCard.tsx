import { useState, Fragment } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Assessment } from "@/types/assessment";
import { RiskBadge } from "./RiskBadge";
import { RiskScoreBar } from "./RiskScoreBar";

interface AssessmentCardProps {
  item: Assessment;
  onDelete?: () => void;
  onExpand: () => void;
  onViewTimeline?: () => void;
}

export function AssessmentCard({ item, onDelete, onExpand, onViewTimeline }: AssessmentCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <Fragment>
      <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-3 mx-5">
        {/* Header */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 pr-3">
            <Text className="font-bold text-[15px] text-gray-900" numberOfLines={1}>
              {item.patientName}
            </Text>
            <Text className="text-xs text-gray-400 mt-1" numberOfLines={1}>
              {item.patientId}
            </Text>
          </View>
          <View className="flex-row gap-2">
            {onViewTimeline && (
              <TouchableOpacity
                onPress={onViewTimeline}
                activeOpacity={0.7}
                className="w-[34px] h-[34px] rounded-lg border border-gray-200 items-center justify-center"
              >
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={() => setShowDeleteModal(true)}
                activeOpacity={0.7}
                className="w-[34px] h-[34px] rounded-lg border border-gray-200 items-center justify-center"
              >
                <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
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

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
        statusBarTranslucent
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-8">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Assessment
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this assessment for{"\n"}
              <Text className="font-semibold">{item.patientName}</Text>?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-gray-300 py-3.5 items-center"
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteModal(false);
                  onDelete?.();
                }}
                className="flex-1 rounded-xl bg-red-500 py-3.5 items-center"
              >
                <Text className="font-semibold text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
}
