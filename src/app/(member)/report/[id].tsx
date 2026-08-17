import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { MemberShell } from "@/components/MemberShell";
import { getMemberAssessment } from "@/services/memberService";
import { useAuthStore } from "@/store/authStore";

const RISK_STYLES = {
  High: { bg: "#FEE2E2", text: "#DC2626" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  Low: { bg: "#DCFCE7", text: "#16A34A" },
} as const;

export default function MemberReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const token = useAuthStore((state) => state.session?.access_token);

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["member-assessment", id, token],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      return await getMemberAssessment(id, token);
    },
    enabled: !!id && !!token,
  });

  if (!token) {
    return (
      <MemberShell theme="main" showHeader={false}>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-gray-400 text-sm">Sign in to view this report.</Text>
        </View>
      </MemberShell>
    );
  }

  if (isLoading) {
    return (
      <MemberShell theme="main" showHeader={false}>
        <View className="flex-1 items-center justify-center px-5">
          <ActivityIndicator color="#DB2777" />
        </View>
      </MemberShell>
    );
  }

  if (isError || !report) {
    return (
      <MemberShell theme="main" showHeader={false}>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-gray-400 text-sm">Report not found</Text>
        </View>
      </MemberShell>
    );
  }

  const riskStyle = RISK_STYLES[report.risk_level];

  return (
    <MemberShell theme="main" showHeader={false}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 8,
            backgroundColor: "white",
            borderRadius: 12,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "600", color: "#111827" }}>
          Assessment Result
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <View className="gap-3">
          <View
            className="bg-white rounded-xl border border-gray-100 p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">{report.patient_name}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">{report.patient_id}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">{report.sample_date}</Text>
              </View>

              <View className="px-3 py-1 rounded-full" style={{ backgroundColor: riskStyle.bg }}>
                <Text className="text-xs font-semibold" style={{ color: riskStyle.text }}>
                  {report.risk_level}
                </Text>
              </View>
            </View>

            <View className="mt-4 pt-3 border-t border-gray-100">
              <Text className="text-xs text-gray-400">Suggested action</Text>
              <Text className="text-sm font-semibold text-gray-900 mt-1">{report.suggested_action}</Text>
            </View>
          </View>

          <View
            className="bg-white rounded-xl border border-gray-100 p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text className="text-sm font-bold text-gray-900">Top contributing factors</Text>
            <View className="mt-3 pt-3 border-t border-gray-100 gap-3">
              {report.top_factors.map((factor, index) => (
                <View key={`${factor.feature}-${index}`} className="flex-row items-start justify-between gap-3">
                  <Text className="text-sm font-semibold text-gray-900 flex-1">{factor.feature}</Text>
                  <Text className="text-xs text-gray-500 flex-1 text-right leading-5">{factor.explanation}</Text>
                </View>
              ))}
            </View>
          </View>

{report.ood_warning?.has_warning && (
              <View
                className="bg-white rounded-xl border border-gray-100 p-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name="warning-outline" size={18} color="#D97706" />
                  <Text className="text-sm font-bold text-gray-900">Out-of-distribution warning</Text>
                </View>
                <Text className="text-xs text-gray-500 mt-2 leading-5">
                  Some of the information you provided is outside the typical range used in this assessment. This doesn't change your result, but it's good to know.
                </Text>
                {(report.ood_warning?.has_warning ?? false) && (report.ood_warning?.flagged_features ?? []).map((f) => (
                  <Text key={f} className="font-semibold text-gray-900 mt-1">
                    {f}{report.ood_warning.flagged_features.indexOf(f) < report.ood_warning.flagged_features.length - 1 && ", "}
                  </Text>
                ))}
              </View>
            )}

          <View
            className="bg-white rounded-xl border border-gray-100 p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text className="text-sm font-bold text-gray-900">Model limitations</Text>
            <View className="mt-3 pt-3 border-t border-gray-100">
              <Text className="text-xs text-gray-500 leading-5">{report.model_limitations}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </MemberShell>
  );
}
