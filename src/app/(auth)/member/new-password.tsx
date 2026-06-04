import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import SuccessIcon from "@/assets/icons/success-2.svg";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { updatePassword } from "@/lib/auth";
import { newPasswordSchema } from "@/lib/validations/auth";
import type { NewPasswordFormData } from "@/types/auth";

const NewPassword = () => {
  const router = useRouter();
  useLocalSearchParams<{ email: string }>();
  const [successVisible, setSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordFormData) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const { error } = await updatePassword({
        newPassword: data.password,
      });

      if (error) {
        setFormError(error.message);
      } else {
        setSuccessVisible(true);
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogContinue = () => {
    setSuccessVisible(false);
    router.push("/(auth)/member/sign-in");
  };

  return (
    <AuthShell showBackButton role="member">
      <View className="w-full gap-6">
        {/* Header */}
        <View className="items-center gap-2">
          <Text className="text-2xl font-semibold text-center">
            Set New Password
          </Text>
          <Text className="text-base text-gray-600 text-center">
            Password must be at least 8 characters
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm text-gray-600 font-medium">
              New Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm">{errors.password.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm text-gray-600 font-medium">
              Confirm Password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm">{errors.confirmPassword.message}</Text>
            )}
          </View>
        </View>

        {formError && (
          <Text className="text-red-500 text-sm text-center">{formError}</Text>
        )}

        {/* Button */}
        <Button
          className="w-full rounded-2xl h-14 bg-[#DB2777]"
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

      {/* Success Dialog */}
      <Dialog open={successVisible} onOpenChange={setSuccessVisible}>
        <DialogContent className="items-center gap-2 rounded-3xl pt-4">
          <SuccessIcon />
          <View className="items-center gap-3 w-full">
            <DialogTitle className="text-2xl font-medium text-center text-[#030712]">
              Password Updated
            </DialogTitle>
            <DialogDescription className="text-center text-[#1F2937] text-base">
              Your new password has been set successfully.
            </DialogDescription>
          </View>

          <DialogFooter className="w-full">
            <Button
              className="bg-[#DB2777] rounded-[20px] h-14 mt-6 px-10"
              onPress={handleDialogContinue}
            >
              <Text className="text-white font-medium text-base text-center">Continue</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthShell>
  );
};

export default NewPassword;
