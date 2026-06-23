import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnalysisResults } from "@/components/member/AnalysisResults";
import { MemberShell } from "@/components/MemberShell";

export default function ResultsScreen() {
  const Header = (
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
        Analysis Results
      </Text>
    </View>
  );

  return (
    <MemberShell theme="main" headerContent={Header}>
      <View style={{ paddingHorizontal: 20 }}>
        <AnalysisResults hideHeading />
      </View>
    </MemberShell>
  );
}
