import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { Mail } from "lucide-react-native";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const isFilled = email.length > 0;

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
            <Input
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {email.length === 0 && (
              <View className="absolute left-4 top-0 bottom-0 justify-center">
                <Mail size={16} color="#9CA3AF" />
              </View>
            )}
          </View>
        </View>

        {/* Button */}
        <Button
          className={`w-full rounded-2xl h-14 ${
            isFilled ? "bg-[#2563EB]" : "bg-[#BFDBFE]"
          }`}
          onPress={() => {
            // navigate to otp
          }}
        >
          <Text className="text-white font-medium text-base">Continue</Text>
        </Button>
      </View>
    </AuthShell>
  );
};

export default ForgotPassword;