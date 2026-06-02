import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ClinicianShell } from "@/components/ClinicianShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useManualAssessmentStore } from "@/store/manualAssessmentStore";

export default function ManualBloodScreen() {
  const { bloodData, setBloodData } = useManualAssessmentStore();

  const fields = [
    { key: "body_mass_index", label: "Body Mass Index (BMI)" },
    { key: "glucose", label: "Glucose" },
    { key: "insulin", label: "Insulin" },
    { key: "homeostasis_model_assessment", label: "HOMA" },
    { key: "leptin", label: "Leptin" },
    { key: "adiponectin", label: "Adiponectin" },
    { key: "resistin", label: "Resistin" },
    { key: "monocyte_chemoattractant_protein", label: "MCP-1" },
  ] as const;

  const Header = (
    <View style={{
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    }}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={{ padding: 8, backgroundColor: "white", borderRadius: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
      >
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "600", color: "#111827" }}>Blood Panel Data</Text>
    </View>
  );

  return (
    <ClinicianShell headerContent={Header}>
      <View style={{ padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
          Enter blood biomarker values below. All values should be numeric.
        </Text>

        <View style={{ gap: 20 }}>
          {fields.map((field) => (
            <View key={field.key} style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
                {field.label}
              </Text>
              <Input
                placeholder="0.00"
                keyboardType="numeric"
                value={(bloodData as any)[field.key] || ""}
                onChangeText={(text) => setBloodData({ [field.key]: text } as any)}
              />
            </View>
          ))}
        </View>

        <Button 
          onPress={() => router.back()}
          className="mt-4 bg-[#2563EB]"
        >
          <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>Save and Return</Text>
        </Button>
      </View>
    </ClinicianShell>
  );
}
