import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { ClinicianShell } from "@/components/ClinicianShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/context/QueryProvider";
import { parseValidationErrors } from "@/lib/errors";
import {
  professionalDetailsSchema,
  type ProfessionalDetailsFormData,
} from "@/lib/validations/profile";
import {
  updateProfile,
  type ProfileUpdateRequest,
  type UserProfile,
} from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

const FIELD_CONFIG = {
  institution: {
    label: "Institution",
    placeholder: "e.g. Lagos University Teaching Hospital",
    keyboardType: "default" as const,
  },
  specialisation: {
    label: "Specialisation",
    placeholder: "e.g. Oncology",
    keyboardType: "default" as const,
  },
  experience_years: {
    label: "Experience years",
    placeholder: "e.g. 5",
    keyboardType: "numeric" as const,
  },
  location: {
    label: "Location",
    placeholder: "e.g. Lagos, Nigeria",
    keyboardType: "default" as const,
  },
} as const;

type FieldKey = keyof typeof FIELD_CONFIG;

function buildPayload(data: ProfessionalDetailsFormData): ProfileUpdateRequest {
  return {
    institution: data.institution?.trim() || undefined,
    specialisation: data.specialisation?.trim() || undefined,
    experience_years: data.experience_years ? Number(data.experience_years) : undefined,
    location: data.location?.trim() || undefined,
  };
}

export default function EditProfileScreen() {
  const token = useAuthStore((state) => state.session?.access_token);
  const profile = queryClient.getQueryData<UserProfile>(["user", "profile"]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalDetailsFormData>({
    resolver: zodResolver(professionalDetailsSchema),
    defaultValues: {
      institution: profile?.institution ?? "",
      specialisation: profile?.specialisation ?? "",
      experience_years:
        profile?.experience_years !== null && profile?.experience_years !== undefined
          ? String(profile.experience_years)
          : "",
      location: profile?.location ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProfessionalDetailsFormData) => {
      if (!token) throw new Error("No authentication token available");
      return updateProfile(buildPayload(data), token);
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["user", "profile"], updatedProfile);
      router.back();
    },
  });

  const onSubmit = (data: ProfessionalDetailsFormData) => {
    mutation.mutate(data);
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
        Professional details
      </Text>
    </View>
  );

  const renderField = (key: FieldKey) => {
    const config = FIELD_CONFIG[key];
    const message = errors[key]?.message;
    return (
      <View style={{ gap: 8 }} key={key}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
          {config.label}
        </Text>
        <Controller
          control={control}
          name={key}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={config.placeholder}
              keyboardType={config.keyboardType}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {message && (
          <Text style={{ fontSize: 12, color: "#DC2626" }}>{message}</Text>
        )}
      </View>
    );
  };

  return (
    <ClinicianShell headerContent={Header} justifyTop>
      <View style={{ padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>
          Update your professional details. These are shown to other members
          and clinicians in the community.
        </Text>

        {(Object.keys(FIELD_CONFIG) as FieldKey[]).map(renderField)}

        {mutation.isError && (
          <View className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-600">
              {mutation.error instanceof Error
                ? parseValidationErrors(mutation.error.message) ||
                  mutation.error.message ||
                  "Failed to update profile. Please try again."
                : "Failed to update profile. Please try again."}
            </Text>
          </View>
        )}

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          className="mt-2 bg-[#2563EB]"
        >
          {mutation.isPending ? (
            <View className="flex-row items-center justify-center gap-2">
              <ActivityIndicator size="small" color="white" />
              <Text style={{ color: "white", fontWeight: "600" }}>
                Saving...
              </Text>
            </View>
          ) : (
            <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
              Save changes
            </Text>
          )}
        </Button>
      </View>
    </ClinicianShell>
  );
}