import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BatchUpload } from "@/components/clinician/BatchUpload";
import { ManualEntry } from "@/components/clinician/ManualEntry";
import { ClinicianShell } from "@/components/ClinicianShell";

export default function ClinicianHome() {
  const [activeTab, setActiveTab] = useState<"batch" | "manual">("manual");

  return (
    <ClinicianShell>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
          marginVertical: 20,
          marginBottom: 30,
          backgroundColor: "#F1F5F9",
          borderRadius: 12,
          padding: 4,
          alignSelf: "flex-start",
          gap: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("manual")}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: activeTab === "manual" ? "#FFFFFF" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 16,
            //   fontWeight: "500",
              color: activeTab === "manual" ? "#111827" : "#9CA3AF",
            }}
          >
            Manual entry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("batch")}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor:
              activeTab === "batch" ? "#FFFFFF" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 16,
            //   fontWeight: "500",
              color: activeTab === "batch" ? "#111827" : "#9CA3AF",
            }}
          >
            Batch upload
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "manual" && <ManualEntry />}

      {activeTab === "batch" && <BatchUpload />}
      
    </ClinicianShell>
  );
}