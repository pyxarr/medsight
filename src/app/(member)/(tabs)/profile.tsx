import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/context/QueryProvider";
import { signOut } from "@/lib/auth";
import { getCurrentUserProfile } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { MemberProfileHeader } from "@/components/member/profile/MemberProfileHeader";
import { MemberProfileRow } from "@/components/member/profile/MemberProfileRow";
import { MemberProfileSection } from "@/components/member/profile/MemberProfileSection";
import { MemberShell } from "@/components/MemberShell";

export default function Profile() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const clearSession = useAuthStore((state) => state.clearSession);
  const token = useAuthStore((state) => state.session?.access_token);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["member", "profile", token],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      return await getCurrentUserProfile(token);
    },
    enabled: !!token,
  });

  if (!token) {
    return (
      <MemberShell theme="main" scrollable={false} showHeader={false}>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-gray-400 text-sm">Sign in to view your profile.</Text>
        </View>
      </MemberShell>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      clearSession();
      queryClient.clear();
      router.replace("/(auth)/member/sign-in");
    } catch (error) {
      Alert.alert("Logout failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <MemberShell theme="main" scrollable={false} showHeader={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-xl font-bold text-gray-900 text-center pt-4 pb-2">
          Profile
        </Text>

        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#DB2777" />
          </View>
        ) : null}

        <MemberProfileHeader
          name={profile?.display_name ?? "Loading..."}
          handle={profile?.username ? `@${profile.username}` : "Loading..."}
          avatarUrl={profile?.avatar_url ?? undefined}
          onEditPress={() => Alert.alert("Coming soon", "Profile editing will be enabled once the backend contract is ready.")}
        />

        <MemberProfileSection title="Account">
          <MemberProfileRow icon="person-outline" label={profile?.display_name ?? "Display name"} />
          <MemberProfileRow icon="at-outline" label={profile?.username ? `@${profile.username}` : "Username"} />
          <MemberProfileRow icon="mail-outline" label={profile?.email ?? "Email"} />
          <MemberProfileRow
            icon="lock-closed-outline"
            label="Password"
            onPress={() => router.push("/(auth)/member/password")}
          />
        </MemberProfileSection>

        <MemberProfileSection
          title="Verification"
          badge={profile?.is_verified ? undefined : 1}
          variant="muted"
        >
          <MemberProfileRow
            icon="mail-outline"
            label={profile?.is_verified ? "Email verified" : "Email not verified"}
            showDot={!profile?.is_verified}
          />
        </MemberProfileSection>

        <View className="mx-5 mt-2 gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            className="border border-gray-300 rounded-full py-4 items-center bg-white"
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#DB2777" />
            ) : (
              <Text className="text-[#DB2777] font-semibold text-base">Log out</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="items-center py-2"
            onPress={() => Alert.alert("Coming soon", "Delete account will be available once the backend endpoint is ready.")}
          >
            <Text className="text-red-500 text-sm">Delete account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MemberShell>
  );
}
