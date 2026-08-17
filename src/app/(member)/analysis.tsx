import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MemberShell } from "@/components/MemberShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitMemberAssessment } from "@/services/memberService";
import { useAuthStore } from "@/store/authStore";
import { useManualAssessmentStore, type ClinicalData } from "@/store/manualAssessmentStore";
import type { MemberManualAssessmentRequest } from "@/types/member";

function SelectionField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T | "";
  onChange: (val: T) => void;
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
              borderColor: value === opt ? "#DB2777" : "#D1D5DB",
              backgroundColor: value === opt ? "#FDF2F8" : "white",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: value === opt ? "#DB2777" : "#6B7280",
                fontWeight: value === opt ? "600" : "400",
              }}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function MemberAnalysisScreen() {
  const token = useAuthStore((state) => state.session?.access_token);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const {
    firstName,
    lastName,
    setPatientInfo,
    clinicalData,
    setClinicalData,
  } = useManualAssessmentStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      return await submitMemberAssessment(
        {
          first_name: (firstName || (user?.user_metadata?.first_name as string) || "").trim(),
          last_name: (lastName || (user?.user_metadata?.last_name as string) || "").trim(),
          clinical_data: {
            age: clinicalData.age || "",
            menopause_status: (clinicalData.menopause || "") as MemberManualAssessmentRequest["clinical_data"]["menopause_status"],
            tumour_size_cm: clinicalData.tumor_size_cm || "",
            invasive_nodes: clinicalData.invasive_nodes || "",
            breast_side: (clinicalData.breast_side || "") as MemberManualAssessmentRequest["clinical_data"]["breast_side"],
            metastasis: (clinicalData.metastasis || "") as MemberManualAssessmentRequest["clinical_data"]["metastasis"],
            breast_quadrant: (clinicalData.breast_quadrant || "") as MemberManualAssessmentRequest["clinical_data"]["breast_quadrant"],
            breast_disease_history: (clinicalData.breast_disease_history || "") as MemberManualAssessmentRequest["clinical_data"]["breast_disease_history"],
          },
        },
        token,
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["member-assessments"] });
      router.push({
        pathname: "/(member)/report/[id]",
        params: { id: response.assessment_id },
      });
    },
    onError: (error) => {
      Alert.alert(
        "Assessment failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    },
  });

  const numericFields: {
    key: keyof Pick<ClinicalData, "age" | "tumor_size_cm" | "invasive_nodes">;
    label: string;
    placeholder: string;
  }[] = [
    { key: "age", label: "Patient Age", placeholder: "e.g. 45" },
    { key: "tumor_size_cm", label: "Tumor Size (cm)", placeholder: "e.g. 2.5" },
    { key: "invasive_nodes", label: "Invasive Nodes", placeholder: "e.g. 1" },
  ];

  const handleSubmit = async () => {
    await mutateAsync();
  };

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
        Run Analytics
      </Text>
    </View>
  );

  return (
    <MemberShell theme="main" headerContent={Header}>
      <View style={{ padding: 20, gap: 24 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
          Enter your clinical information below to run a breast cancer risk
          assessment.
        </Text>

        {/* Patient Info */}
        <View style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>First Name</Text>
            <Input
              placeholder="Enter first name"
              value={firstName || (user?.user_metadata?.first_name as string) || ""}
              onChangeText={(text) => setPatientInfo({ firstName: text })}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>Last Name</Text>
            <Input
              placeholder="Enter last name"
              value={lastName || (user?.user_metadata?.last_name as string) || ""}
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
                value={clinicalData[field.key] || ""}
                onChangeText={(text) => setClinicalData({ [field.key]: text } as Partial<ClinicalData>)}
              />
            </View>
          ))}
        </View>

        {/* Selection Fields */}
        <View style={{ gap: 24 }}>
          <SelectionField
            label="Menopause Status"
            options={["premenopausal", "postmenopausal"] as const}
            value={(clinicalData.menopause ?? "") as "" | "premenopausal" | "postmenopausal"}
            onChange={(val) => setClinicalData({ menopause: val })}
          />

          <SelectionField
            label="Breast Side"
            options={["left", "right"] as const}
            value={(clinicalData.breast_side ?? "") as "" | "left" | "right"}
            onChange={(val) => setClinicalData({ breast_side: val })}
          />

          <SelectionField
            label="Metastasis"
            options={["no", "yes"] as const}
            value={(clinicalData.metastasis ?? "") as "" | "no" | "yes"}
            onChange={(val) => setClinicalData({ metastasis: val })}
          />

          <SelectionField
            label="Breast Disease History"
            options={["no", "yes"] as const}
            value={(clinicalData.breast_disease_history ?? "") as "" | "no" | "yes"}
            onChange={(val) => setClinicalData({ breast_disease_history: val })}
          />

          <SelectionField
            label="Breast Quadrant"
            options={["upper outer", "upper inner", "lower outer", "lower inner"] as const}
            value={(clinicalData.breast_quadrant ?? "") as
              | ""
              | "upper outer"
              | "upper inner"
              | "lower outer"
              | "lower inner"}
            onChange={(val) => setClinicalData({ breast_quadrant: val })}
          />
        </View>

        <Button onPress={handleSubmit} className="mt-4 bg-[#DB2777]" disabled={isPending}>
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
              Run Analysis
            </Text>
          )}
        </Button>
      </View>
    </MemberShell>
  );
}
