import { View, Text } from "react-native";
import { RISK_CONFIG, type RiskLevel } from "@/types/assessment";

interface RiskBadgeProps {
  level: RiskLevel;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const config = RISK_CONFIG[level];
  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
      }}
    >
      <Text style={{ color: config.text, fontWeight: "600", fontSize: 13 }}>
        {level}
      </Text>
    </View>
  );
}