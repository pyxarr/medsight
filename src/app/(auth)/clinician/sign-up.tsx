import React, { useRef } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import GoogleIcon from "@/assets/icons/google.svg";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const ClinicianSignUp = () => {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

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

  return (
    <AuthShell scrollRef={scrollRef}>
      <View className="w-full gap-3">
        {/* Header */}
        <View className="items-center gap-1">
          <Image
            source={require("@/assets/images/logo.png")}
            className="mb-2"
          />
          <Text className="text-2xl font-semibold">Clinician Portal</Text>
          <Text className="text-base text-gray-600 text-center">
            Sign up to access the clinical decision support dashboard
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
          <View
            onLayout={(e) =>
              (positions.current.firstName = e.nativeEvent.layout.y)
            }
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Firstname</Text>
            <Input
              onFocus={() => scrollTo("firstName")}
              placeholder="Firstname"
            />
          </View>

          <View
            onLayout={(e) =>
              (positions.current.lastName = e.nativeEvent.layout.y)
            }
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Lastname</Text>
            <Input
              onFocus={() => scrollTo("lastName")}
              placeholder="Lastname"
            />
          </View>

          <View
            onLayout={(e) => (positions.current.email = e.nativeEvent.layout.y)}
            className="gap-2"
          >
            <Text className="text-sm text-gray-600 font-medium">Email</Text>
            <Input
              onFocus={() => scrollTo("email")}
              keyboardType="email-address"
              placeholder="Email"
            />
          </View>
        </View>

        {/* Continue Button */}
        <Button className="bg-[#BFDBFE] rounded-2xl h-14 w-full mt-4" onPress={() => router.push('/(auth)/clinician/otp')}>
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
            <Button variant="link" className="-ml-4" onPress={() => router.push('/(auth)/clinician/sign-in')}>
              <Text className="text-blue-600">Sign in</Text>
            </Button>
          </View>

          <Text className="text-xs text-gray-400 text-center">
            By signing up, you acknowledge that you are an authorized healthcare
            professional with appropriate credentials.
          </Text>
        </View>
      </View>
    </AuthShell>
  );
};

export default ClinicianSignUp;
