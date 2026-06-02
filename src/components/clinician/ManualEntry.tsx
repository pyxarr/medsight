import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { submitManualAssessment } from "@/services/assessmentService";
import { useAuthStore } from "@/store/authStore";
import { useManualAssessmentStore } from "@/store/manualAssessmentStore";

export function ManualEntry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuthStore();
  const { 
    firstName, 
    lastName, 
    clinicalData, 
    bloodData, 
    resetAssessment 
  } = useManualAssessmentStore();

  const isClinicalFilled = 
    firstName.trim() !== "" && 
    lastName.trim() !== "" && 
    Object.values(clinicalData).every(val => val !== "");
  
  const isBloodFilled = Object.values(bloodData).some(val => val !== "");

      const handleSubmit = async () => {
        if (!session) {
          Alert.alert("Error", "You must be logged in to submit an assessment.");
          return;
        }

        setIsSubmitting(true);
        try {
          const payload = {
            first_name: firstName,
            last_name: lastName,
            clinical_data: clinicalData,
            blood_panel: isBloodFilled ? bloodData : undefined,
          };

          const result = await submitManualAssessment(payload, session.access_token);
          
          // Reset store after successful submission
          resetAssessment();
          
          // Navigate to the report screen, passing the result data directly for instant loading
          router.push({ 
            pathname: `/(clinician)/report/${result.assessment_id}` as any, 
            params: { data: JSON.stringify(result) } 
          });
        } catch (error: any) {
          Alert.alert("Submission Failed", error.message || "An unexpected error occurred.");
        } finally {
          setIsSubmitting(false);
        }
      };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, gap: 16 }}>
      {/* Clinical data — always selected */}
      <TouchableOpacity
        onPress={() => router.push("/(clinician)/manual-clinical")}
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
        activeOpacity={0.8}
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
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            backgroundColor: isClinicalFilled ? "#2563EB" : "#D1D5DB",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
            marginTop: 2,
          }}
        >
          {isClinicalFilled && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
      </TouchableOpacity>

      {/* Blood data — toggleable */}
      <TouchableOpacity
        onPress={() => router.push("/(clinician)/manual-blood")}
        style={{
          backgroundColor: isBloodFilled ? "#F5F3FF" : "#FAFAFA",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: isBloodFilled ? "#DDD6FE" : "#F3F4F6",
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
              backgroundColor: isBloodFilled ? "#EDE9FE" : "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="water"
              size={20}
              color={isBloodFilled ? "#7C3AED" : "#9CA3AF"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: "600",
                color: isBloodFilled ? "#111827" : "#6B7280",
                marginBottom: 4,
              }}
            >
              Blood data
            </Text>
            <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 20 }}>
              Analyzes blood based biomarkers and related indicators to assess
              risk, offering additional insights for a more complete report.
            </Text>
          </View>
        </View>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: isBloodFilled ? "#7C3AED" : "#D1D5DB",
            backgroundColor: isBloodFilled ? "#7C3AED" : "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
            marginTop: 2,
          }}
        >
          {isBloodFilled && (
            <Ionicons name="checkmark" size={14} color="white" />
          )}
        </View>
      </TouchableOpacity>

      {/* CTA */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: isClinicalFilled ? "#2563EB" : "#9CA3AF",
          borderRadius: 999,
          paddingVertical: 16,
          alignItems: "center",
          marginTop: 4,
        }}
        activeOpacity={0.8}
        disabled={!isClinicalFilled || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            View Analysis report
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
