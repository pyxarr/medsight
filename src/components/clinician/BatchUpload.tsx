import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { submitBatchAssessment } from "@/services/assessmentService";
import { useAuthStore } from "@/store/authStore";
import type { BatchAssessmentResponse } from "@/types/assessment";
import { parseValidationErrors } from "@/lib/errors";

export function BatchUpload() {
  const session = useAuthStore((state) => state.session);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation<BatchAssessmentResponse, Error, { uri: string; name: string; mimeType: string }>({
    mutationFn: (file) => {
      const accessToken = session?.access_token ?? "";
      return submitBatchAssessment(file, accessToken);
    },
    onSuccess: (response) => {
      setErrorMessage(null);
      router.push({
        pathname: "/(clinician)/batch-results",
        params: { data: JSON.stringify(response) },
      });
    },
    onError: (error) => {
      if (__DEV__) console.error("Batch upload error:", error);
      setErrorMessage(
        parseValidationErrors(error.message)
          || error.message
          || "Upload failed. Please check your file and try again.",
      );
    },
  });

  const handleSelectFile = async () => {
    setErrorMessage(null);

    const pickerResult = await DocumentPicker.getDocumentAsync({
      type: ["*/*"],
      copyToCacheDirectory: true,
    });

    // If the user cancelled the picker, do nothing
    if (pickerResult.canceled) {
      return;
    }

    const selectedAsset = pickerResult.assets[0];

    const fileExtension = selectedAsset.name.split(".").pop()?.toLowerCase();

    if (fileExtension !== "csv" && fileExtension !== "xlsx" && fileExtension !== "xls") {
      setErrorMessage("Please select a CSV or Excel file.");
      return;
    }

    // Determine the correct MIME type based on file extension
    const mimeType =
      fileExtension === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : fileExtension === "xls"
          ? "application/vnd.ms-excel"
          : "text/csv";

    const fileToUpload = {
      uri: selectedAsset.uri,
      name: selectedAsset.name,
      mimeType,
    };

    mutation.mutate(fileToUpload);
  };

  return (
    <View className="flex-1 px-5">
      {/* Upload Card */}
      <View className="bg-[#EFF6FF] border border-dashed border-[#93C5FD] rounded-3xl p-8 items-center mb-4">
        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-5">
          <Ionicons name="share-outline" size={32} color="#2563EB" />
        </View>
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Upload patient data
        </Text>
        <Text className="text-sm text-gray-500 text-center mb-6">
          Upload batch data (Clinical, Biopsy & Blood models supported)
        </Text>
        <TouchableOpacity
          className={`flex-row items-center gap-2 px-6 py-3 rounded-md mb-3 ${mutation.isPending ? "bg-blue-400" : "bg-blue-600"
            }`}
          onPress={handleSelectFile}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="document-text-outline" size={18} color="white" />
          )}
          <Text className="text-white font-semibold">
            {mutation.isPending ? "Uploading..." : "Select CSV or Excel file"}
          </Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-400">
          Download template{" "}
          <Text className="text-blue-600 underline">here</Text>
        </Text>
        <Text className="text-xs text-gray-400 mt-8">
          Supported format: CSV or Excel with standard tumour feature columns
        </Text>
      </View>

      {/* Error message */}
      {errorMessage && (
        <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
          <Text className="text-sm text-red-600">{errorMessage}</Text>
        </View>
      )}

      {/* Disclaimer */}
      <View className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
        <Text className="text-sm">
          <Text className="font-bold text-red-600">
            This tool provides clinical decision support only —{" "}
          </Text>
          <Text className="text-gray-600">
            it does not provide diagnosis or replace professional medical
            judgment...
          </Text>
          <Text className="text-blue-600"> More</Text>
        </Text>
      </View>
    </View>
  );
}
