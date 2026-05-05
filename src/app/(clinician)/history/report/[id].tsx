import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CrossDatasetAgreement } from "@/components/clinician/report/CrossDatasetAgreement";
import { KeyContributingFactors } from "@/components/clinician/report/KeyContributingFactors";
import { ReportDisclaimer } from "@/components/clinician/report/ReportDisclaimer";
import { RiskSummaryCard } from "@/components/clinician/report/RiskSummaryCard";
import { SuggestedAction } from "@/components/clinician/report/SuggestedAction";
import { ClinicianShell } from "@/components/ClinicianShell";
import { MOCK_REPORTS } from "@/types/report";

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const report = MOCK_REPORTS.find((r) => r.id === id);

  if (!report) {
    return (
      <ClinicianShell>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-sm">Assessment not found.</Text>
        </View>
      </ClinicianShell>
    );
  }

  return (
    <ClinicianShell>
      {/* Back + Title */}
      <View className="px-5 mb-6">
        <Text className="text-2xl font-bold text-gray-900">Analysis Result</Text>
      </View>

      {/* Patient ID + Sample */}
      <View className="px-5 mb-6">
        <Text className="text-lg font-bold text-gray-900">{report.patientId}</Text>
        <Text className="text-sm text-gray-400 mt-0.5">
          Sample {report.sampleId} – {report.sampleDate}
        </Text>
      </View>

      {/* Sections */}
      <View className="gap-6 pb-6">
        <RiskSummaryCard report={report} />
        <CrossDatasetAgreement level={report.agreementLevel} />
        <KeyContributingFactors drivers={report.riskDrivers} />
        <SuggestedAction action={report.suggestedAction} />
        <ReportDisclaimer />
      </View>
    </ClinicianShell>
  );
}