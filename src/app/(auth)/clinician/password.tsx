import React, { useRef, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { signUpClinician } from "@/lib/auth";
import { passwordSchema } from "@/lib/validations/auth";
import type { PasswordFormData } from "@/types/auth";

const ClinicianPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ firstName: string; lastName: string; email: string }>();
  const scrollRef = useRef<ScrollView>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const positions = useRef({
    password: 0,
    confirm: 0,
  });

  const scrollTo = (key: keyof typeof positions.current) => {
    scrollRef.current?.scrollTo({
      y: positions.current[key] - 120,
      animated: true,
    });
  };

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const { error } = await signUpClinician({
        email: params.email,
        password: data.password,
        firstName: params.firstName,
        lastName: params.lastName,
      });

      if (error) {
        setFormError(error.message);
      } else {
        router.push(`/(auth)/clinician/otp?flow=signup&email=${encodeURIComponent(params.email)}`);
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell scrollRef={scrollRef} showBackButton>
      <View className="w-full gap-3">
        {/* Header */}
        <View className="items-center gap-1">
          <Image
            source={require("@/assets/images/logo.png")}
            className="mb-2"
          />
          <Text className="text-2xl font-semibold">Clinician Portal</Text>
          <Text className="text-base text-gray-600 text-center">
            Access the clinical decision support dashboard
          </Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">Not a clinician? </Text>
            <Button variant="link" className="-ml-4">
              <Text className="text-blue-600">Switch role</Text>
            </Button>
          </View>
        </View>

        {/* Form */}
        <View className="gap-4">
          <View
            onLayout={(e) =>
              (positions.current.password = e.nativeEvent.layout.y)
            }
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  onFocus={() => scrollTo("password")}
                  placeholder="Password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.password && (
              <Text className="text-xs text-red-500">{errors.password.message}</Text>
            )}
          </View>

          <View
            onLayout={(e) =>
              (positions.current.confirm = e.nativeEvent.layout.y)
            }
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">
              Confirm password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  onFocus={() => scrollTo("confirm")}
                  placeholder="Confirm password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-xs text-red-500">{errors.confirmPassword.message}</Text>
            )}
          </View>
        </View>

        {formError && (
          <Text className="text-red-500 text-sm text-center">{formError}</Text>
        )}

        {/* Sign Up Button */}
        <Button
          className="bg-[#2563EB] rounded-2xl h-14 w-full mt-4"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium text-xl">Sign up</Text>
          )}
        </Button>

        {/* Footer */}
        <View className="items-center gap-3 mt-2">
          <Text className="text-xs text-gray-400 text-center">
            By signing up, you acknowledge that you are an authorized healthcare
            professional with appropriate credentials.
          </Text>
        </View>
      </View>
    </AuthShell>
  );
};

export default ClinicianPassword;
