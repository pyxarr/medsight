import React, { useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";

const ACKNOWLEDGEMENTS = [
  {
    id: "decision",
    title: "Decision Support Only",
    description:
      "I understand this system provides clinical decision support only and does not provide diagnoses. All outputs must be interpreted by qualified professionals.",
  },
  {
    id: "data",
    title: "Data Responsibility",
    description:
      "I acknowledge responsibility for any patient data I upload and confirm that appropriate consent and de-identification procedures have been followed.",
  },
  {
    id: "limitations",
    title: "Model Limitations",
    description:
      "I understand the model was trained on retrospective datasets and performance may vary across different patient populations. Out-of-distribution warnings should be heeded.",
  },
  {
    id: "judgment",
    title: "Professional Judgment",
    description:
      "I confirm that clinical decisions remain my professional responsibility and that this tool supplements, but does not replace, clinical judgment.",
  },
];

const ClinicianAcknowledge = () => {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const allChecked = ACKNOWLEDGEMENTS.every((item) => checked[item.id]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAcknowledge = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { acknowledged: true },
      });

      if (error) throw error;
      
      router.replace("/(clinician)" as any);
    } catch (err) {
      console.error("Error updating acknowledgment:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AuthShell>
      <View className="w-full gap-6">
        {/* Header */}
        <View className="items-center gap-2">
          <Image
            source={require("@/assets/images/logo.png")}
            className="mb-2"
          />
          <Text className="text-2xl font-semibold text-center">
            Data Responsibility{"\n"}Acknowledgment
          </Text>
          <Text className="text-base text-gray-600 text-center">
            Please review and acknowledge the following before accessing the
            clinical dashboard
          </Text>
        </View>

        {/* Checklist */}
        <View className="gap-3">
          {ACKNOWLEDGEMENTS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggle(item.id)}
              className="flex-row items-start gap-3 bg-white border border-gray-200 rounded-2xl p-4"
            >
              <Checkbox
                checked={!!checked[item.id]}
                onCheckedChange={() => toggle(item.id)}
                checkedClassName="bg-[#2563EB] border-[#2563EB]"
                className="mt-0.5"
              />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-900">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {item.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Button */}
        <Button
          className={`w-full rounded-2xl h-14 ${
            allChecked ? "bg-[#2563EB]" : "bg-[#BFDBFE]"
          }`}
          disabled={!allChecked || isUpdating}
          onPress={handleAcknowledge}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-medium text-base text-white">
              I acknowledge all items
            </Text>
          )}
        </Button>
      </View>
    </AuthShell>
  );
};

export default ClinicianAcknowledge;
