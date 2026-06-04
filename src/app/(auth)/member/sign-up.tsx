import React, { useRef } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import GoogleIcon from "@/assets/icons/google.svg";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { signUpSchema } from "@/lib/validations/auth";
import type { SignUpFormData } from "@/types/auth";

const MemberSignUp = () => {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const positions = useRef({
    firstName: 0,
    lastName: 0,
    email: 0,
  });

  const scrollTo = (key: keyof typeof positions.current) => {
    scrollRef.current?.scrollTo({
      y: positions.current[key] - 120,
      animated: true,
    });
  };

  const onSubmit = (data: SignUpFormData) => {
    const params = new URLSearchParams({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
    router.push(`/(auth)/clinician/password?${params.toString()}`);
  };

  return (
    <AuthShell scrollRef={scrollRef} role="member">
      <View className="w-full gap-3">
        {/* Header */}
        <View className="items-center gap-1">
          <Image
            source={require("@/assets/images/logo-3.png")}
            className="mb-2"
          />
          <Text className="text-2xl font-semibold">Member Portal</Text>
          <Text className="text-base text-gray-600 text-center">
            Sign up to access the medical dashboard
          </Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">Not a Member? </Text>
            <Button variant="link" className="-ml-4" onPress={() => router.push('/onboarding/role-selection')}>
              <Text className="text-[#DB2777]">Switch role</Text>
            </Button>
          </View>
        </View>

        {/* Form */}
        <View className="gap-4">
          <View
            onLayout={(e) =>
              (positions.current.firstName = e.nativeEvent.layout.y)
            }
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Firstname</Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <Input
                  onFocus={() => scrollTo("firstName")}
                  placeholder="Firstname"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.firstName && (
              <Text className="text-xs text-red-500">{errors.firstName.message}</Text>
            )}
          </View>

          <View
            onLayout={(e) =>
              (positions.current.lastName = e.nativeEvent.layout.y)
            }
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Lastname</Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <Input
                  onFocus={() => scrollTo("lastName")}
                  placeholder="Lastname"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.lastName && (
              <Text className="text-xs text-red-500">{errors.lastName.message}</Text>
            )}
          </View>

          <View
            onLayout={(e) => (positions.current.email = e.nativeEvent.layout.y)}
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  onFocus={() => scrollTo("email")}
                  keyboardType="email-address"
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.email && (
              <Text className="text-xs text-red-500">{errors.email.message}</Text>
            )}
          </View>
        </View>

        {/* Continue Button */}
        <Button
          className="bg-[#FBCFE8] rounded-2xl h-14 w-full mt-4"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white font-medium text-xl">Continue</Text>
        </Button>

        <View className="w-full gap-6 mt-4">
          {/* Divider */}
          <View className="flex-row items-center gap-3">
            <Separator className="flex-1 bg-[#9CA3AF]" />
            <Text className="text-base text-[#6B7280]">Or sign up with</Text>
            <Separator className="flex-1 bg-[#9CA3AF]" />
          </View>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full rounded-2xl h-14 border-gray-200 bg-white active:bg-white"
          >
            <GoogleIcon width={20} height={20} />
            <Text className="text-black text-xl">Google</Text>
          </Button>
        </View>

        {/* Footer */}
        <View className="items-center gap-3">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">Have an account? </Text>
            <Button variant="link" className="-ml-4" onPress={() => router.push('/(auth)/member/sign-in')}>
              <Text className="text-[#DB2777]">Sign in</Text>
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

export default MemberSignUp;
