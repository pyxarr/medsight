import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { RiskDriver } from "@/types/report";

interface KeyContributingFactorsProps {
  drivers: RiskDriver[];
}

function DriverRow({ driver }: { driver: RiskDriver }) {
  const increases = driver.contribution > 0;
  const color = increases ? "#EF4444" : "#22C55E";
  const icon = increases ? "arrow-up" : "arrow-down";
  const label = `${increases ? "+" : ""}${driver.contribution}%`;

  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <Text className="text-sm text-gray-700">
        <Text className="text-gray-400">#{driver.rank} </Text>
        {driver.featureName}
      </Text>
      <View className="flex-row items-center gap-1">
        <Ionicons name={icon} size={14} color={color} />
        <Text style={{ color, fontSize: 13, fontWeight: "600" }}>{label}</Text>
      </View>
    </View>
  );
}

export function KeyContributingFactors({ drivers }: KeyContributingFactorsProps) {
  return (
    <View className="mx-5">
      {/* Header */}
      <View className="flex-row items-center gap-2 mb-2">
        <Ionicons name="pulse-outline" size={16} color="#374151" />
        <Text className="text-xs font-semibold tracking-widest text-gray-700 uppercase">
          Key Contributing Factors
        </Text>
      </View>

      {/* Rows */}
      <View>
        {drivers.map((driver) => (
          <DriverRow key={driver.rank} driver={driver} />
        ))}
      </View>

      {/* Footer note */}
      <Text className="text-xs text-gray-400 mt-3">
        Factors reflect model weighing, not casual relationships
      </Text>
    </View>
  );
}