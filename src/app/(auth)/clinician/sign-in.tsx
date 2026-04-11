import React, { useRef, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, AlertCircle } from "lucide-react-native";
import GoogleIcon from "@/assets/icons/google.svg";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const ClinicianSignIn = () => {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");

  const positions = useRef({ email: 0, password: 0 });

  const scrollTo = (key: keyof typeof positions.current) => {
    scrollRef.current?.scrollTo({
      y: positions.current[key] - 120,
      animated: true,
    });
  };

  const isEmailValid = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isFilled = email.length > 0 && password.length > 0;

  const handleEmailBlur = () => {
    if (email.length > 0 && !isEmailValid(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  return (
    <AuthShell scrollRef={scrollRef}>
      <View className="w-full gap-6">
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
            <Button variant="link" className="-ml-4" onPress={() => router.push('/onboarding/role-selection')}>
              <Text className="text-blue-600">Switch role</Text>
            </Button>
          </View>
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* Email */}
          <View
            onLayout={(e) =>
              (positions.current.email = e.nativeEvent.layout.y)
            }
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Email</Text>
            <View className="relative">
              <Input
                onFocus={() => scrollTo("email")}
                onBlur={handleEmailBlur}
                placeholder=""
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                  setLoginError("");
                }}
                className={emailError ? "border-red-500" : ""}
              />
              {email.length === 0 && (
                <View className="absolute left-4 top-0 bottom-0 justify-center">
                  <Mail size={16} color="#9CA3AF" />
                </View>
              )}
            </View>
            {emailError ? (
              <Text className="text-red-500 text-sm">{emailError}</Text>
            ) : null}
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
              <Input
                onFocus={() => scrollTo("password")}
                placeholder=""
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setLoginError("");
                }}
              />
              {password.length === 0 && (
                <View className="absolute left-4 top-0 bottom-0 justify-center">
                  <Lock size={16} color="#9CA3AF" />
                </View>
              )}
              {password.length > 0 && (
                <Button
                  variant="ghost"
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-0 bottom-0 justify-center"
                >
                  <Text className="text-gray-400 text-xs">
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Button>
              )}
            </View>
            <View className="items-end">
              <Button variant="link" onPress={() => router.push('/(auth)/clinician/forgot-password')}>
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
          className={`w-full rounded-2xl h-14 ${
            isFilled ? "bg-[#2563EB]" : "bg-[#BFDBFE]"
          }`}
          disabled={!isFilled}
          onPress={() => {
            // handle sign in logic here
            console.warn('Sign in pressed');
          }}
        >
          <Text className="text-white font-medium text-base">Sign in</Text>
        </Button>

        {/* Divider */}
        <View className="flex-row items-center gap-3">
          <Separator className="flex-1 bg-[#9CA3AF]" />
          <Text className="text-sm text-[#6B7280]">Sign in with google</Text>
          <Separator className="flex-1 bg-[#9CA3AF]" />
        </View>

        {/* Google Button */}
        <Button
          variant="outline"
          className="w-full rounded-2xl h-14 border-gray-200 bg-white"
        >
          <GoogleIcon width={20} height={20} />
          <Text className="text-black font-medium">Google</Text>
        </Button>

        {/* Footer */}
        <View className="items-center gap-3">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">Don&apos;t have an account? </Text>
            <Button variant="link" className="-ml-4" onPress={() => router.push('/(auth)/clinician/sign-up')}>
              <Text className="text-blue-600">Sign up</Text>
            </Button>
          </View>
          <Text className="text-xs text-gray-400 text-center">
            By signing in, you acknowledge that you are an authorized healthcare
            professional with appropriate credentials.
          </Text>
        </View>
      </View>
    </AuthShell>
  );
};

export default ClinicianSignIn;