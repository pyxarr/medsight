import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { resetPasswordRequest } from "@/lib/auth";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import type { ForgotPasswordFormData } from "@/types/auth";

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const { error } = await resetPasswordRequest({ email: data.email });

      if (error) {
        setFormError(error.message);
      } else {
        router.push(`/(auth)/clinician/otp?flow=reset&email=${encodeURIComponent(data.email)}`);
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell showBackButton>
      <View className="w-full gap-6">
        {/* Header */}
        <View className="items-center gap-2">
          <Text className="text-2xl font-semibold text-center">
            Forgot Password?
          </Text>
          <Text className="text-base text-gray-600 text-center">
            No worries, enter your email and we will help you reset it quickly
          </Text>
        </View>

        {/* Form */}
        <View className="gap-2">
          <Text className="text-sm text-gray-600 font-medium">Email</Text>
          <View className="relative">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder=""
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  className={errors.email ? "border-red-500" : ""}
                />
              )}
            />
            {/* Using a static check for icon visibility since we don't have a simple length variable anymore */}
            <View className="absolute left-4 top-0 bottom-0 justify-center pointer-events-none">
              <Mail size={16} color="#9CA3AF" />
            </View>
          </View>
          {errors.email && (
            <Text className="text-red-500 text-sm">{errors.email.message}</Text>
          )}
        </View>

        {formError && (
          <Text className="text-red-500 text-sm text-center">{formError}</Text>
        )}

        {/* Button */}
        <Button
          className="w-full rounded-2xl h-14 bg-[#2563EB]"
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium text-base">Continue</Text>
          )}
        </Button>
      </View>
    </AuthShell>
  );
};

export default ForgotPassword;
