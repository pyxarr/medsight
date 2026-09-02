import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const code = params.code as string | undefined;

    if (!code) {
      router.replace("/onboarding/role-selection");
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
      if (error || !data.session) {
        router.replace("/onboarding/role-selection");
        return;
      }

      const role = data.session.user.user_metadata?.role;

      if (role === "clinician") {
        router.replace("/(clinician)/(tabs)" as any);
      } else if (role === "member") {
        router.replace("/(member)/(tabs)" as any);
      } else {
        router.replace("/onboarding/role-selection");
      }
    });
  }, [params.code, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
