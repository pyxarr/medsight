import React, { useRef, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ClinicianPassword = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [showPassword] = useState(false);
  const [showConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const passwordMismatch = confirm.length > 0 && password !== confirm;

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
            <Input
              onFocus={() => scrollTo("password")}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
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
            <Input
              onFocus={() => scrollTo("confirm")}
              placeholder="Confirm password"
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={setConfirm}
              className={passwordMismatch ? "border-red-500" : ""}
            />
            {passwordMismatch && (
              <Text className="text-red-500 text-sm">
                Password doesn&apos;t match
              </Text>
            )}
          </View>
        </View>

        {/* Sign Up Button */}
        <Button className="bg-[#2563EB] rounded-2xl h-14 w-full mt-4">
          <Text className="text-white font-medium text-xl">Sign up</Text>
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