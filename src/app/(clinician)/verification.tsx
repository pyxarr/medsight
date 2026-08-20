import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { ClinicianShell } from "@/components/ClinicianShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/context/QueryProvider";
import { parseValidationErrors } from "@/lib/errors";
import {
  ApiError,
  submitVerification,
  type VerificationFile,
} from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

function verificationErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 413) {
      return "File is too large. Maximum size is 5MB.";
    }
    if (error.status === 500) {
      return "Upload failed. Please try again.";
    }
    if (error.status === 0) {
      return "Network error. Please check your connection and try again.";
    }
    return (
      parseValidationErrors(error.message) ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message || "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export default function VerificationScreen() {
  const session = useAuthStore((state) => state.session);
  const token = session?.access_token;

  const [licenceNumber, setLicenceNumber] = useState("");
  const [document, setDocument] = useState<VerificationFile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error("No authentication token available");
      return submitVerification({ medicalLicenceNumber: licenceNumber.trim(), file: document ?? undefined }, token);
    },
    onSuccess: (profile) => {
      setErrorMessage(null);
      queryClient.setQueryData(["user", "profile"], profile);
      setSubmitted(true);
    },
    onError: (error) => {
      if (__DEV__) console.error("Verification submission error:", error);
      setErrorMessage(verificationErrorMessage(error));
    },
  });

  const handleSelectDocument = async () => {
    setErrorMessage(null);

    const pickerResult = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (pickerResult.canceled) {
      return;
    }

    const asset = pickerResult.assets[0];

    if (asset.size !== undefined && asset.size > MAX_FILE_BYTES) {
      setErrorMessage("File is too large. Maximum size is 5MB.");
      return;
    }

    setDocument({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType ?? "application/octet-stream",
    });
  };

  const handleSubmit = () => {
    setErrorMessage(null);
    if (!licenceNumber.trim()) {
      setErrorMessage("Please enter your medical licence number.");
      return;
    }
    mutation.mutate();
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
        Verification
      </Text>
    </View>
  );

  return (
    <ClinicianShell headerContent={Header} justifyTop>
      {submitted ? (
        <View style={{ padding: 20, gap: 16, alignItems: "center" }}>
          <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-2">
            <Ionicons name="checkmark" size={40} color="#16A34A" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827", textAlign: "center" }}>
            Verification submitted
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 20 }}>
            We&apos;ve received your details. An admin will review and verify
            your licence. This usually takes a little while — check back on
            your profile for the status.
          </Text>
          <Button
            onPress={() => router.back()}
            className="mt-2 bg-[#2563EB]"
          >
            <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
              Back to profile
            </Text>
          </Button>
        </View>
      ) : (
      <View style={{ padding: 20, gap: 24 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
          Submit your medical licence number and, optionally, a copy of your
          licence document. An admin will review and verify your details.
        </Text>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
            Medical licence number
          </Text>
          <Input
            placeholder="Enter your licence number"
            value={licenceNumber}
            onChangeText={setLicenceNumber}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
            Licence document (optional)
          </Text>
          <TouchableOpacity
            onPress={handleSelectDocument}
            disabled={mutation.isPending}
            activeOpacity={0.8}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white py-4"
          >
            <Ionicons
              name={document ? "document-attach" : "cloud-upload-outline"}
              size={20}
              color={document ? "#2563EB" : "#9CA3AF"}
            />
            <Text
              className="text-sm font-medium"
              style={{ color: document ? "#2563EB" : "#6B7280" }}
            >
              {document ? document.name : "Select document"}
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
            PDF, image or document up to 5MB
          </Text>
        </View>

        {errorMessage && (
          <View className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-600">{errorMessage}</Text>
          </View>
        )}

        <Button
          onPress={handleSubmit}
          disabled={mutation.isPending}
          className="mt-2 bg-[#2563EB]"
        >
          {mutation.isPending ? (
            <View className="flex-row items-center justify-center gap-2">
              <ActivityIndicator size="small" color="white" />
              <Text style={{ color: "white", fontWeight: "600" }}>
                Submitting...
              </Text>
            </View>
          ) : (
            <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
              Submit verification
            </Text>
          )}
        </Button>
      </View>
      )}
    </ClinicianShell>
  );
}