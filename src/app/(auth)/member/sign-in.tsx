import React, { useRef, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, AlertCircle } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import GoogleIcon from "@/assets/icons/google.svg";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signInClinician } from "@/lib/auth";
import { signInSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";
import type { SignInFormData } from "@/types/auth";

const MemberSignIn = () => {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const user = useAuthStore((state) => state.user);
  const scrollRef = useRef<ScrollView>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const positions = useRef({ email: 0, password: 0 });

  const scrollTo = (key: keyof typeof positions.current) => {
    scrollRef.current?.scrollTo({
      y: positions.current[key] - 120,
      animated: true,
    });
  };

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const { data: responseData, error } = await signInClinician({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setLoginError(error.message);
      } else if (responseData?.session) {
        setSession(responseData.session);
        router.replace("/(clinician)" as any);
      }
    } catch (err) {
      console.error("Unexpected error during sign-in:", err);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell scrollRef={scrollRef} role="member">
      <View className="w-full gap-2">
        {/* Header */}
        <View className="items-center gap-1">
          <Image
            source={require("@/assets/images/logo-3.png")}
            className="mb-2"
          />
          <Text className="text-2xl font-semibold">Member Portal</Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            This section provides educational resources and community experiences.
          </Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">Not a Member? </Text>
            <Button
              variant="link"
              className="-ml-4"
              onPress={() => router.push("/onboarding/role-selection")}
            >
              <Text className="text-[#DB2777]">Switch role</Text>
            </Button>
          </View>
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* Email */}
          <View
            onLayout={(e) => (positions.current.email = e.nativeEvent.layout.y)}
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Email</Text>
            <View className="relative">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    onFocus={() => scrollTo("email")}
                    placeholder=""
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                )}
              />
              {!user && (
                <View className="absolute left-4 top-0 bottom-0 justify-center">
                  <Mail size={16} color="#9CA3AF" />
                </View>
              )}
            </View>
            {errors.email && (
              <Text className="text-red-500 text-sm">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View
            onLayout={(e) =>
              (positions.current.password = e.nativeEvent.layout.y)
            }
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Password</Text>
            <View className="relative">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    onFocus={() => scrollTo("password")}
                    placeholder=""
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {/* Icon spacing fix: the current UI uses a fixed absolute position, 
                  we check value length to decide whether to show icon */}
              <View className="absolute left-4 top-0 bottom-0 justify-center pointer-events-none">
                <Lock size={16} color="#9CA3AF" />
              </View>
              {/* I kept the original logic for the toggle button but removed the 
                  incorrect a check for password.length since we are using Controller now */}
              <Button
                variant="ghost"
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-0 bottom-0 justify-center"
              >
                <Text className="text-gray-400 text-xs">
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Button>
            </View>
            <View className="items-end">
              <Button
                variant="link"
                onPress={() => router.push("/(auth)/member/forgot-password")}
              >
                <Text className="text-gray-400 text-sm">Forgot password?</Text>
              </Button>
            </View>
          </View>
        </View>

        {/* Login Error */}
        {loginError ? (
          <View className="bg-red-50 border border-red-100 rounded-2xl p-4 items-center gap-1">
            <AlertCircle size={20} color="#EF4444" />
            <Text className="text-red-500 font-semibold">Login Error!</Text>
            <Text className="text-red-400 text-sm text-center">
              {loginError}
            </Text>
          </View>
        ) : null}

        {/* Sign In Button */}
        <Button
          className="w-full rounded-2xl h-14 bg-[#EC4899] mb-4"
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium text-base">Sign in</Text>
          )}
        </Button>

        {/* Divider */}
        <View className="flex-row items-center gap-3 mb-4">
          <Separator className="flex-1 bg-[#9CA3AF]" />
          <Text className="text-sm text-[#6B7280]">Sign in with google</Text>
          <Separator className="flex-1 bg-[#9CA3AF]" />
        </View>

        {/* Google Button */}
        <Button
          variant="outline"
          className="w-full rounded-2xl h-14 border-gray-200 bg-white"
          onPress={() => {
            // Google sign-in remains unimplemented
          }}
        >
          <GoogleIcon width={20} height={20} />
          <Text className="text-black font-medium">Google</Text>
        </Button>

        {/* Footer */}
        <View className="items-center gap-3">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
            </Text>
            <Button
              variant="link"
              className="-ml-4"
              onPress={() => router.push("/(auth)/member/sign-up")}
            >
              <Text className="text-[#DB2777]">Sign up</Text>
            </Button>
          </View>
          <Text className="text-xs text-gray-400 text-center">
            By signing in, you confirm that the information you provide is
            accurate and that you will use this platform responsibly.
          </Text>
        </View>
      </View>
    </AuthShell>
  );
};

export default MemberSignIn;
