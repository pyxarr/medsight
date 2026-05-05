import { View, Text } from "react-native";
import { RISK_CONFIG, type RiskLevel } from "@/types/assessment";

interface RiskScoreBarProps {
  score: number;
  level: RiskLevel;
}

export function RiskScoreBar({ score, level }: RiskScoreBarProps) {
  const config = RISK_CONFIG[level];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <View
        style={{
          flex: 1,
          height: 6,
          backgroundColor: "#F3F4F6",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${score * 100}%`,
            height: "100%",
            backgroundColor: config.bar,
            borderRadius: 999,
          }}
        />
      </View>
      <Text style={{ fontSize: 13, color: "#374151", fontWeight: "500", minWidth: 32 }}>
        {score}
      </Text>
    </View>
  );
}