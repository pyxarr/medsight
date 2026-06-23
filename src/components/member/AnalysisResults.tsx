import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ANALYSIS_DATA } from "@/data/analysisMockData";

const FILTERS = ["All", "Success", "High risk"] as const;

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Success: { bg: "#DCFCE7", text: "#16A34A" },
  "High risk": { bg: "#FEE2E2", text: "#DC2626" },
};

interface AnalysisResultsProps {
  maxItems?: number;
  hideHeading?: boolean;
}

export function AnalysisResults({ maxItems, hideHeading }: AnalysisResultsProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"All" | "Success" | "High risk">("All");

  const allFiltered =
    activeFilter === "All"
      ? ANALYSIS_DATA
      : ANALYSIS_DATA.filter((d) => d.status === activeFilter);

  const filtered = maxItems ? allFiltered.slice(0, maxItems) : allFiltered;

  return (
    <View>
      {!hideHeading && (
        <Text className="text-lg font-bold text-gray-900 mb-3">
          Analysis results
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row gap-2">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? "border-[#DB2777] bg-[#FDF2F8]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isActive ? "text-[#DB2777]" : "text-gray-500"
                  }`}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {filtered.length === 0 ? (
        <Text className="text-sm text-gray-400 text-center py-8">
          No results found
        </Text>
      ) : (
        <View className="gap-3">
          {filtered.map((item) => {
            const statusStyle = STATUS_STYLES[item.status];
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => router.push({
                  pathname: "/(member)/report/[id]",
                  params: { id: item.id },
                } as any)}
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
                    <Text className="text-base font-bold text-gray-900">
                      {item.patientName}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-0.5">
                      {item.patientId}
                    </Text>
                  </View>

                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: statusStyle.bg }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: statusStyle.text }}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-xs text-gray-400">Risk level :</Text>
                    <Text
                      className={`text-xs font-bold ${
                        item.riskLevel === "High" ? "text-[#DC2626]" : "text-[#16A34A]"
                      }`}
                    >
                      {item.riskLevel}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-xs text-gray-400">Confidence :</Text>
                    <Text className="text-xs font-bold text-gray-900">
                      {item.confidence}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {maxItems && allFiltered.length > maxItems && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/(member)/results")}
          className="items-center py-3 mt-2"
        >
          <Text className="text-sm font-semibold text-[#DB2777]">
            View All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
