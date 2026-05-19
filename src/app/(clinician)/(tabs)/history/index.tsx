import { useState, useMemo } from "react";
import { FlatList, View } from "react-native";
import { router } from "expo-router";
import { AssessmentCard } from "@/components/clinician/history/AssessmentCard";
import { HistorySearchBar } from "@/components/clinician/history/HistorySearchBar";
import { ClinicianShell } from "@/components/ClinicianShell";
import type { Assessment } from "@/types/assessment";

const MOCK_DATA: Assessment[] = [
  { id: "1", patientId: "P-2026-9032", sampleDate: "21/3/2026", riskLevel: "High",   riskScore: 0.91, confidence: 88 },
  { id: "2", patientId: "P-2026-9031", sampleDate: "21/3/2026", riskLevel: "Low",    riskScore: 0.12, confidence: 88 },
  { id: "3", patientId: "P-2026-9030", sampleDate: "20/3/2026", riskLevel: "High",   riskScore: 0.91, confidence: 88 },
  { id: "4", patientId: "P-2026-9029", sampleDate: "19/3/2026", riskLevel: "Medium", riskScore: 0.54, confidence: 72 },
  { id: "5", patientId: "P-2026-9028", sampleDate: "18/3/2026", riskLevel: "Low",    riskScore: 0.08, confidence: 91 },
];

export default function History() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Assessment[]>(MOCK_DATA);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter((item) =>
      item.patientId.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExpand = (id: string) => {
    router.push({
      pathname: "/(clinician)/report/[id]",
      params: { id }
    });
  };

  return (
    <ClinicianShell scrollable={false}>
      <View className="flex-1 pt-2">
        <HistorySearchBar value={search} onChangeText={setSearch} />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AssessmentCard
              item={item}
              onDelete={() => handleDelete(item.id)}
              onExpand={() => handleExpand(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ClinicianShell>
  );
}