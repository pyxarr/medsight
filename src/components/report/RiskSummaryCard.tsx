import { View, Text } from "react-native";
import { RiskBadge } from "@/components/clinician/history/RiskBadge";
import type { ReportData } from "@/types/report";

interface RiskSummaryCardProps {
  report: ReportData;
}

export function RiskSummaryCard({ report }: RiskSummaryCardProps) {
  return (
    <View className="mx-5 border border-gray-200 rounded-2xl p-4">
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Risk Assessment Summary
        </Text>
        <RiskBadge level={report.riskLevel} />
      </View>

      {/* Score + Confidence */}
      <View className="flex-row gap-8 mb-4">
        <View>
          <Text className="text-3xl font-bold text-gray-900">{report.riskScore}</Text>
          <Text className="text-xs text-gray-400 mt-1">Risk score (0–1)</Text>
        </View>
        <View>
          <Text className="text-3xl font-bold text-gray-900">{report.confidence}%</Text>
          <Text className="text-xs text-gray-400 mt-1">Model Confidence</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-100 mb-3" />

      {/* Disclaimer */}
      <Text className="text-xs text-gray-400">
        Model confidence ≠ clinical certainty. Interpret in clinical context.
      </Text>
    </View>
  );
}