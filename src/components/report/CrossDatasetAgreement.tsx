import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AGREEMENT_CONFIG, type AgreementLevel } from "@/types/report";

interface CrossDatasetAgreementProps {
  level: AgreementLevel;
}

export function CrossDatasetAgreement({ level }: CrossDatasetAgreementProps) {
  const config = AGREEMENT_CONFIG[level];
  return (
    <View className="mx-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Cross-Dataset Agreement
        </Text>
        <View
          style={{
            backgroundColor: config.bg,
            borderWidth: 1,
            borderColor: config.border,
            borderRadius: 999,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 4,
            gap: 4,
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={14} color={config.text} />
          <Text style={{ color: config.text, fontSize: 13, fontWeight: "600" }}>
            {level}
          </Text>
        </View>
      </View>
      <View className="h-px bg-gray-100 mt-4" />
    </View>
  );
}