import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";

import { verifyOtp, resendOtp } from "@/lib/auth";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

type OtpState = "idle" | "error" | "success";

const ClinicianOtp = () => {
  const router = useRouter();
  const { email, flow } = useLocalSearchParams<{ email: string; flow: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpState, setOtpState] = useState<OtpState>("idle");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const isFilled = otp.every((d) => d.length === 1);

  useEffect(() => {
    if (countdown === 0) {
      setTimeout(() => setCanResend(true), 0);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpState("idle");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isFilled) return;
    setIsLoading(true);
    setOtpState("idle");

    try {
      const { error } = await verifyOtp({
        email,
        token: otp.join(""),
      });

      if (error) {
        setOtpState("error");
      } else {
        setOtpState("success");
        if (flow === "signup") {
          router.push("/(auth)/clinician/acknowledge");
        } else if (flow === "reset") {
          router.push(`/(auth)/clinician/new-password?email=${encodeURIComponent(email)}`);
        }
      }
    } catch {
      setOtpState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);

    try {
      const { error } = await resendOtp({ email });
      if (error) {
        setOtpState("error");
      } else {
        setOtp(Array(OTP_LENGTH).fill(""));
        setOtpState("idle");
        setCountdown(RESEND_SECONDS);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setOtpState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const boxColor = () => {
    if (otpState === "error") return "border-red-400 bg-red-50";
    if (otpState === "success") return "border-green-400 bg-green-50";
    return "border-gray-200 bg-gray-100";
  };

  return (
    <AuthShell showBackButton>
      <View className="w-full gap-6">
        {/* Header */}
        <View className="items-center gap-2">
          <Text className="text-2xl font-semibold text-center">
            Verify Account with OTP
          </Text>
          <Text className="text-base text-gray-600 text-center">
            We&apos;ve sent a 6-digit code to your email
          </Text>
        </View>

        {/* OTP Boxes */}
        <View className="flex-row justify-between gap-2">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              className={`flex-1 h-14 rounded-xl border-2 text-center text-lg font-semibold ${boxColor()}`}
              style={{ color: "#111827" }}
            />
          ))}
        </View>

        {/* Error state */}
        {otpState === "error" && (
          <View className="items-center gap-1">
            <Text className="text-red-500 text-sm">
              Incorrect code, please try again
            </Text>
            {canResend ? (
              <Pressable onPress={handleResend}>
                <Text className="text-blue-600 text-sm font-medium">
                  Resend code
                </Text>
              </Pressable>
            ) : (
              <Text className="text-gray-500 text-sm">
                Resend code in {countdown}
              </Text>
            )}
          </View>
        )}

        {/* Idle resend */}
        {otpState === "idle" && (
          <View className="items-center">
            {canResend ? (
              <Pressable onPress={handleResend}>
                <Text className="text-blue-600 text-sm font-medium">
                  Resend code
                </Text>
              </Pressable>
            ) : (
              <Text className="text-gray-500 text-sm">
                Didn&apos;t get code? Request code in {countdown}
              </Text>
            )}
          </View>
        )}

        {/* Success state */}
        {otpState === "success" && (
          <View className="items-center">
            <Text className="text-green-500 text-sm font-medium">
              Accepted ✓
            </Text>
          </View>
        )}

        {/* Button */}
        <Button
          className={`w-full rounded-2xl h-14 ${
            isFilled && otpState !== "error" ? "bg-[#2563EB]" : "bg-[#BFDBFE]"
          }`}
          disabled={!isFilled || otpState === "error" || isLoading}
          onPress={handleVerify}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium text-base">Continue</Text>
          )}
        </Button>

        {/* Footer */}
        <Text className="text-xs text-gray-400 text-center">
          By signing in, you acknowledge that you are an authorized healthcare
          professional with appropriate credentials.
        </Text>
      </View>
    </AuthShell>
  );
};

export default ClinicianOtp;
