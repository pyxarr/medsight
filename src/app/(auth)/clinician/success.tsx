import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";

export default function ClinicianGoogleSuccess() {
  const router = useRouter();

  return (
    <AuthShell>
      <View className="w-full gap-6 items-center">
        <View className="items-center gap-2">
          <Text className="text-3xl font-semibold text-center">Account created</Text>
          <Text className="text-base text-gray-600 text-center">
            Your clinician account is ready. Please complete the acknowledgment step next.
          </Text>
        </View>

        <Button
          className="w-full rounded-2xl h-14 bg-[#2563EB]"
          onPress={() => router.replace("/(auth)/clinician/acknowledge" as any)}
        >
          <Text className="text-white font-medium text-base">Continue to acknowledgment</Text>
        </Button>
      </View>
    </AuthShell>
  );
}
