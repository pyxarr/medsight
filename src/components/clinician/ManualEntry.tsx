import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export function ManualEntry() {
  const [biopsySelected, setBiopsySelected] = useState(false);

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, gap: 16 }}>
      {/* Clinical data — always selected */}
      <View
        style={{
          backgroundColor: "#EFF6FF",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#BFDBFE",
          padding: 16,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#DBEAFE",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="people-outline" size={20} color="#2563EB" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontWeight: "600", color: "#111827", marginBottom: 4 }}
            >
              Clinical data
            </Text>
            <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 20 }}>
              Uses patient clinical data such as age, medical history, and key
              health indicators to estimate breast cancer risk and provide a
              baseline assessment
            </Text>
          </View>
        </View>
        {/* Always checked — not toggleable */}
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            backgroundColor: "#2563EB",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
            marginTop: 2,
          }}
        >
          <Ionicons name="checkmark" size={14} color="white" />
        </View>
      </View>

      {/* Biopsy data — toggleable */}
      <TouchableOpacity
        onPress={() => setBiopsySelected(!biopsySelected)}
        style={{
          backgroundColor: biopsySelected ? "#F5F3FF" : "#FAFAFA",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: biopsySelected ? "#DDD6FE" : "#F3F4F6",
          padding: 16,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: biopsySelected ? "#EDE9FE" : "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="stethoscope"
              size={20}
              color={biopsySelected ? "#7C3AED" : "#9CA3AF"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: "600",
                color: biopsySelected ? "#111827" : "#6B7280",
                marginBottom: 4,
              }}
            >
              Biopsy data
            </Text>
            <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 20 }}>
              Analyzes biopsy findings including tissue characteristics and
              pathology results to deliver a more detailed and evidence based
              risk assessment.
            </Text>
          </View>
        </View>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: biopsySelected ? "#7C3AED" : "#D1D5DB",
            backgroundColor: biopsySelected ? "#7C3AED" : "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
            marginTop: 2,
          }}
        >
          {biopsySelected && (
            <Ionicons name="checkmark" size={14} color="white" />
          )}
        </View>
      </TouchableOpacity>

      {/* Blood data — disabled */}
      <View
        style={{
          backgroundColor: "#FFF1F2",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#FFE4E6",
          padding: 16,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          opacity: 0.8,
        }}
      >
        <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FFE4E6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="water-outline" size={20} color="#F43F5E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontWeight: "600", color: "#9CA3AF", marginBottom: 4 }}
            >
              Blood data
            </Text>
            <Text style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 20 }}>
              Evaluates blood based biomarkers and related indicators to assess
              risk, offering additional insights when processed through batch
              data upload
            </Text>
            <Text
              style={{ fontSize: 12, color: "#F43F5E", marginTop: 8, lineHeight: 18 }}
            >
              <Text style={{ fontWeight: "600" }}>Note</Text>: Blood data must
              be entered using batch upload only. Manual entry is not supported.
            </Text>
          </View>
        </View>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: "#FECDD3",
            marginLeft: 8,
            marginTop: 2,
            opacity: 0.5,
          }}
        />
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={{
          backgroundColor: "#2563EB",
          borderRadius: 999,
          paddingVertical: 16,
          alignItems: "center",
          marginTop: 4,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
          View Analysis report
        </Text>
      </TouchableOpacity>
    </View>
  );
}