import type { ComponentProps } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MemberProfileRowProps {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
  showDot?: boolean;
}

export function MemberProfileRow({ icon, label, onPress, showDot = false }: MemberProfileRowProps) {
  const isInteractive = !!onPress;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isInteractive ? 0.7 : 1}
      className="flex-row items-center justify-between px-4 py-3.5"
      disabled={!isInteractive}
    >
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={18} color="#9CA3AF" />
        <Text className="text-sm text-gray-700">{label}</Text>
        {showDot && (
          <View className="w-1.5 h-1.5 rounded-full bg-red-500" />
        )}
      </View>
      {isInteractive && (
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
}
