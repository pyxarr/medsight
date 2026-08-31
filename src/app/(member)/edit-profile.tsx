import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { MemberShell } from "@/components/MemberShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/context/QueryProvider";
import { parseValidationErrors } from "@/lib/errors";
import {
  memberProfileSchema,
  type MemberProfileFormData,
} from "@/lib/validations/profile";
import {
  updateProfile,
  checkUsernameAvailability,
  type ProfileUpdateRequest,
  type UserProfile,
} from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

const FIELD_CONFIG = {
  display_name: {
    label: "Display name",
    placeholder: "e.g. John Doe",
    keyboardType: "default" as const,
  },
  username: {
    label: "Username",
    placeholder: "e.g. johndoe",
    keyboardType: "default" as const,
  },
  location: {
    label: "Location",
    placeholder: "e.g. Lagos, Nigeria",
    keyboardType: "default" as const,
  },
} as const;

type FieldKey = keyof typeof FIELD_CONFIG;

function buildPayload(data: MemberProfileFormData): ProfileUpdateRequest {
  return {
    display_name: data.display_name?.trim() || undefined,
    username: data.username?.trim() || undefined,
    location: data.location?.trim() || undefined,
  };
}

export default function EditProfileScreen() {
  const token = useAuthStore((state) => state.session?.access_token);
  const profile = queryClient.getQueryData<UserProfile>(["member", "profile", token]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MemberProfileFormData>({
    resolver: zodResolver(memberProfileSchema),
    defaultValues: {
      display_name: profile?.display_name ?? "",
      username: profile?.username ?? "",
      location: profile?.location ?? "",
    },
  });

  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const username = watch("username") ?? "";

  useEffect(() => {
    const currentUsername = profile?.username ?? "";
    if (!username.trim() || username === currentUsername) {
      setUsernameStatus("idle");
      setUsernameError(null);
      return;
    }

    if (!token) return;

    const timer = setTimeout(async () => {
      setUsernameStatus("checking");
      setUsernameError(null);
      try {
        const result = await checkUsernameAvailability(username.toLowerCase(), token);
        setUsernameStatus(result.available ? "available" : "taken");
        if (!result.available) {
          setUsernameError("Username is already taken");
        }
      } catch {
        setUsernameStatus("idle");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [username, token, profile?.username]);

  const mutation = useMutation({
    mutationFn: async (data: MemberProfileFormData) => {
      if (!token) throw new Error("No authentication token available");
      return updateProfile(buildPayload(data), token);
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["member", "profile", token], updatedProfile);
      router.back();
    },
    onError: (error: unknown) => {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 409) {
        setUsernameStatus("taken");
        setUsernameError("Username already taken");
      }
    },
  });

  const onSubmit = (data: MemberProfileFormData) => {
    if (usernameStatus === "taken") return;
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
        Edit profile
      </Text>
    </View>
  );

  const renderField = (key: FieldKey) => {
    const config = FIELD_CONFIG[key];
    const message = errors[key]?.message;
    const showUsernameStatus = key === "username" && usernameStatus !== "idle";

    return (
      <View style={{ gap: 8 }} key={key}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
          {config.label}
        </Text>
        <View style={{ gap: 4 }}>
          <Controller
            control={control}
            name={key}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder={config.placeholder}
                keyboardType={config.keyboardType}
                value={value}
                onChangeText={onChange}
                className={errors[key] ? "border-red-500" : ""}
              />
            )}
          />
          {key === "username" && showUsernameStatus && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons
                name={usernameStatus === "available" ? "checkmark-circle" : "close-circle"}
                size={16}
                color={usernameStatus === "available" ? "#16A34A" : "#DC2626"}
              />
              <Text style={{ fontSize: 12, color: usernameStatus === "available" ? "#16A34A" : "#DC2626" }}>
                {usernameStatus === "available" ? "Available" : usernameError ?? "Taken"}
              </Text>
            </View>
          )}
          {message && (
            <Text style={{ fontSize: 12, color: "#DC2626" }}>{message}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <MemberShell headerContent={Header} theme="main" justifyTop>
      <View style={{ padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>
          Update your profile details. These are shown to other members
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
          disabled={mutation.isPending || usernameStatus === "taken"}
          className="mt-2 bg-[#DB2777]"
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
    </MemberShell>
  );
}