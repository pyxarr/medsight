import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useManualAssessmentStore, ClinicalData } from "@/store/manualAssessmentStore";
import { ClinicianShell } from "@/components/ClinicianShell";

function SelectionField<T extends string>({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string; 
  options: T[]; 
  value: T | ""; 
  onChange: (val: T) => void 
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>{label}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: value === opt ? "#2563EB" : "#D1D5DB",
              backgroundColor: value === opt ? "#EFF6FF" : "white",
            }}
          >
            <Text style={{ 
              fontSize: 13, 
              color: value === opt ? "#2563EB" : "#6B7280",
              fontWeight: value === opt ? "600" : "400"
            }}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function ManualClinicalScreen() {
  const { firstName, lastName, setPatientInfo, clinicalData, setClinicalData } = useManualAssessmentStore();

  const numericFields = [
    { key: "age", label: "Patient Age", placeholder: "e.g. 45" },
    { key: "tumor_size_cm", label: "Tumor Size (cm)", placeholder: "e.g. 2.5" },
    { key: "invasive_nodes", label: "Invasive Nodes", placeholder: "e.g. 1" },
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
      <Text style={{ fontSize: 20, fontWeight: "600", color: "#111827" }}>Clinical Data</Text>
    </View>
  );

  return (
    <ClinicianShell headerContent={Header}>
      <View style={{ padding: 20, gap: 24 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
          Enter mandatory clinical information. These fields are required for the risk assessment.
        </Text>

        {/* Patient Info */}
        <View style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>First Name</Text>
            <Input
              placeholder="Enter first name"
              value={firstName}
              onChangeText={(text) => setPatientInfo({ firstName: text })}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>Last Name</Text>
            <Input
              placeholder="Enter last name"
              value={lastName}
              onChangeText={(text) => setPatientInfo({ lastName: text })}
            />
          </View>
        </View>

        {/* Numeric Fields */}
        <View style={{ gap: 20 }}>
          {numericFields.map((field) => (
            <View key={field.key} style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
                {field.label}
              </Text>
              <Input
                placeholder={field.placeholder}
                keyboardType="numeric"
                value={(clinicalData as any)[field.key] || ""}
                onChangeText={(text) => setClinicalData({ [field.key]: text } as any)}
              />
            </View>
          ))}
        </View>

        {/* Selection Fields */}
        <View style={{ gap: 24 }}>
          <SelectionField 
            label="Menopause Status" 
            options={["premenopausal", "postmenopausal"]} 
            value={clinicalData.menopause || ""} 
            onChange={(val) => setClinicalData({ menopause: val })} 
          />

          <SelectionField 
            label="Breast Side" 
            options={["left", "right"]} 
            value={clinicalData.breast_side || ""} 
            onChange={(val) => setClinicalData({ breast_side: val })} 
          />

          <SelectionField 
            label="Metastasis" 
            options={["no", "yes"]} 
            value={clinicalData.metastasis || ""} 
            onChange={(val) => setClinicalData({ metastasis: val })} 
          />

          <SelectionField 
            label="Breast Disease History" 
            options={["no", "yes"]} 
            value={clinicalData.breast_disease_history || ""} 
            onChange={(val) => setClinicalData({ breast_disease_history: val })} 
          />

          <SelectionField 
            label="Breast Quadrant" 
            options={["upper outer", "upper inner", "lower outer", "lower inner"]} 
            value={clinicalData.breast_quadrant || ""} 
            onChange={(val) => setClinicalData({ breast_quadrant: val })} 
          />
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
