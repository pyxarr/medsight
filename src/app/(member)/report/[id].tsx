import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MemberShell } from "@/components/MemberShell";
import { RiskSummaryCard } from "@/components/report/RiskSummaryCard";
import { CrossDatasetAgreement } from "@/components/report/CrossDatasetAgreement";
import { KeyContributingFactors } from "@/components/report/KeyContributingFactors";
import { OodWarningCard } from "@/components/report/OodWarningCard";
import { SuggestedAction } from "@/components/report/SuggestedAction";
import { ReportDisclaimer } from "@/components/report/ReportDisclaimer";
import { ANALYSIS_DATA } from "@/data/analysisMockData";

export default function MemberReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const report = ANALYSIS_DATA.find((d) => d.id === id);

  if (!report) {
    return (
      <MemberShell theme="main" showHeader={false}>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-gray-400 text-sm">Report not found</Text>
        </View>
      </MemberShell>
    );
  }

  return (
    <MemberShell theme="main" showHeader={false}>
      {/* Back button */}
      <View className="px-5 pt-2 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View className="px-5 mb-4">
        <Text className="text-2xl font-bold text-gray-900">Analysis Result</Text>
      </View>

      <View className="px-5 mb-6">
        <Text className="text-lg font-bold text-gray-900">{report.patientName}</Text>
        <Text className="text-sm text-gray-500 mt-0.5">{report.patientId}</Text>
        <Text className="text-sm text-gray-400 mt-0.5">
          Assessment #{report.assessmentId} · {report.sampleDate}
        </Text>
      </View>

      <View className="gap-6 pb-6">
        {report.oodWarning?.hasWarning && (
          <OodWarningCard
            flaggedFeatures={report.oodWarning.flaggedFeatures}
            severity={report.oodWarning.severity!}
          />
        )}
        <RiskSummaryCard report={report} />
        <CrossDatasetAgreement level={report.agreementLevel} />
        <KeyContributingFactors drivers={report.riskDrivers} />
        <SuggestedAction
          action={report.suggestedAction}
          riskLevel={report.riskLevel}
          agreementLevel={report.agreementLevel}
          modelsUsed={report.modelsUsed ?? 1}
        />
        <ReportDisclaimer />
      </View>
    </MemberShell>
  );
}
