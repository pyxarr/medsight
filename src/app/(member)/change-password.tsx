import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { MemberShell } from "@/components/MemberShell";
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

export default function ChangePasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

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
      const { error } = await updatePassword({ newPassword: data.password });
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
    router.back();
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
        Change password
      </Text>
    </View>
  );

  return (
    <MemberShell headerContent={Header} theme="main" justifyTop>
      <View style={{ padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>
          Choose a new password. It must be at least 8 characters.
        </Text>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
            New password
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
            <Text style={{ fontSize: 12, color: "#DC2626" }}>
              {errors.password.message}
            </Text>
          )}
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
            Confirm new password
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
            <Text style={{ fontSize: 12, color: "#DC2626" }}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        {formError && (
          <Text style={{ fontSize: 14, color: "#DC2626", textAlign: "center" }}>
            {formError}
          </Text>
        )}

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="mt-2 bg-[#DB2777]"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
              Update password
            </Text>
          )}
        </Button>
      </View>

      <Dialog open={successVisible} onOpenChange={setSuccessVisible}>
        <DialogContent className="items-center gap-2 rounded-3xl pt-4">
          <View className="items-center gap-3 w-full">
            <DialogTitle className="text-2xl font-medium text-center text-[#030712]">
              Password Updated
            </DialogTitle>
            <DialogDescription className="text-center text-[#1F2937] text-base">
              Your password has been changed successfully.
            </DialogDescription>
          </View>

          <DialogFooter className="w-full">
            <Button
              className="bg-[#DB2777] rounded-[20px] w-full mt-6 px-10"
              onPress={handleDialogContinue}
            >
              <Text className="text-white font-medium text-base text-center">Done</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MemberShell>
  );
}