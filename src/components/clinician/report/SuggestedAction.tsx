import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { RiskLevel } from "@/types/assessment";
import type { AgreementLevel } from "@/types/report";

interface SuggestedActionProps {
  action: string;
  riskLevel: RiskLevel;
  agreementLevel: AgreementLevel;
  modelsUsed: number;
}

const GUIDANCE_STYLE = {
  High: { border: "#FECACA", bg: "#FEF2F2", divider: "#FECACA", icon: "#DC2626" },
  Medium: { border: "#FDE68A", bg: "#FFFBEB", divider: "#FDE68A", icon: "#D97706" },
  Low: { border: "#BBF7D0", bg: "#F0FDF4", divider: "#BBF7D0", icon: "#16A34A" },
};

const GUIDANCE_SUBTITLE: Record<string, string> = {
  "High_High": "Specialist consultation may be warranted based on risk indicators. High dataset agreement increases reliability of assessment.",
  "High_Mixed": "Mixed model agreement detected. Clinical correlation is especially important before acting on this result.",
  "High_Low": "Low dataset agreement indicates increased uncertainty. Specialist review is strongly recommended.",
  "High_Single Model": "Only one dataset was available. Provide biopsy or blood panel data to increase assessment confidence.",
  "Medium_High": "Follow-up imaging recommended within 3–6 months. High dataset agreement supports this assessment.",
  "Medium_Mixed": "Mixed model agreement indicates moderate uncertainty. Enhanced monitoring and clinical correlation suggested.",
  "Medium_Low": "Low dataset agreement indicates increased uncertainty. Additional evaluation or clinical correlation is particularly important.",
  "Medium_Single Model": "Only one dataset was available. Consider providing additional test data to improve confidence.",
  "Low_High": "No immediate concerns identified; maintain standard surveillance consistent with established clinical guidelines.",
  "Low_Mixed": "Routine follow-up consistent with established clinical guidelines. High confidence across all datasets.",
  "Low_Low": "Low dataset agreement indicates increased uncertainty. Additional evaluation or clinical correlation is particularly important.",
  "Low_Single Model": "Routine screening schedule recommended. Provide additional test data to further validate this result.",
};

export function SuggestedAction({ action, riskLevel, agreementLevel, modelsUsed }: SuggestedActionProps) {
  const style = GUIDANCE_STYLE[riskLevel];

  const title = action;
  const lookupKey = `${riskLevel}_${agreementLevel}`;
  const subtitle = GUIDANCE_SUBTITLE[lookupKey] ?? null;

  return (
    <View
      className="mx-5 rounded-2xl p-4"
      style={{ backgroundColor: style.bg, borderColor: style.border, borderWidth: 1 }}
    >
      {/* Header row */}
      <View className="flex-row items-center gap-2 mb-3">
        <Ionicons name="medical-outline" size={14} color="#6B7280" />
        <Text className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
          Clinical Guidance (Decision Support)
        </Text>
      </View>

      {/* Title row */}
      <View className="flex-row items-center gap-2 mb-2">
        <Ionicons name="chevron-forward" size={16} color="#374151" />
        <Text className="text-sm font-bold text-gray-900 flex-1">{title}</Text>
      </View>

      {/* Subtitle row */}
      {subtitle !== null && (
        <Text className="text-sm text-gray-500 ml-6 mb-2">{subtitle}</Text>
      )}

      {/* Models used row */}
      <View className="flex-row items-center gap-1.5 mt-1 mb-2 ml-6">
        <Ionicons name="layers-outline" size={14} color="#6B7280" />
        <Text className="text-xs text-gray-500">
          {modelsUsed} {modelsUsed === 1 ? "model" : "models"} used
        </Text>
      </View>

      {/* Divider */}
      <View className="h-px mt-3 mb-3" style={{ backgroundColor: style.divider }} />

      {/* Footer */}
      <Text className="text-xs text-gray-400 italic">
        Decision support only — clinical judgement required
      </Text>
    </View>
  );
}
