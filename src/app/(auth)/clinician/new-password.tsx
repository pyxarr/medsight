import React, { useState } from "react";
import { View, Text } from "react-native";
import { CheckCircle } from "lucide-react-native";
import SuccessIcon from "@/assets/icons/success.svg";
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

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword] = useState(false);
  const [showConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);

  const isFilled = password.length > 0 && confirm.length > 0;

  const handlePasswordBlur = () => {
    if (password.length > 0 && password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  return (
    <AuthShell showBackButton>
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
            <Input
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              onBlur={handlePasswordBlur}
              className={passwordError ? "border-red-500" : ""}
            />
            {passwordError ? (
              <Text className="text-red-500 text-sm">{passwordError}</Text>
            ) : null}
          </View>

          <View className="gap-2">
            <Text className="text-sm text-gray-600 font-medium">
              Confirm Password
            </Text>
            <Input
              placeholder="••••••••"
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>
        </View>

        {/* Button */}
        <Button
          className={`w-full rounded-2xl h-14 ${
            isFilled && !passwordError ? "bg-[#2563EB]" : "bg-[#BFDBFE]"
          }`}
          disabled={!isFilled || !!passwordError}
          onPress={() => setSuccessVisible(true)}
        >
          <Text className="text-white font-medium text-base">Continue</Text>
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

          <DialogFooter>
            <Button
              className="bg-[#2563EB] rounded-[20px] h-14 w-full mt-6"
              onPress={() => {
                setSuccessVisible(false);
              }}
            >
              <Text className="text-white font-medium text-base">Continue</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthShell>
  );
};

export default NewPassword;
